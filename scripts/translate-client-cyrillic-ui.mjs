import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const ROOT = path.resolve('client');
const CYRILLIC = /[А-Яа-яЁё]/;
const SOURCE_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx']);
const TRANSLATE_ENDPOINT = 'https://translate.googleapis.com/translate_a/single';
const CONCURRENCY = 8;
const REQUEST_TIMEOUT_MS = 8000;

// Only keys that are overwhelmingly presentation/UI copy.
// Do not include generic keys such as name, value, category or text because
// they can participate in application behavior.
const UI_PROPERTY_KEYS = new Set([
  'label',
  'title',
  'subtitle',
  'description',
  'placeholder',
  'tooltip',
  'hint',
  'helpText',
  'caption',
  'heading',
  'emptyText',
  'emptyMessage',
  'errorMessage',
  'successMessage',
  'warningMessage',
  'statusText',
  'buttonText',
  'confirmText',
  'cancelText',
  'ariaLabel',
  'displayName',
  'displayLabel',
  'groupLabel',
  'commandDescription',
  'toastTitle',
  'toastDescription',
]);

const UI_JSX_ATTRIBUTES = new Set([
  'title',
  'placeholder',
  'aria-label',
  'alt',
  'label',
  'description',
  'tooltip',
  'data-tooltip',
  'data-title',
]);

const UI_VARIABLE_NAME = /(Label|Title|Subtitle|Description|Placeholder|Tooltip|Hint|HelpText|Caption|Heading|EmptyText|EmptyMessage|ErrorMessage|SuccessMessage|WarningMessage|StatusText|ButtonText|ConfirmText|CancelText|DisplayName|DisplayLabel)$/i;

function isExcludedFile(file) {
  const normalized = file.split(path.sep).join('/');
  return /(^|\/)(__tests__|tests?|fixtures?|mocks?)(\/|$)/i.test(normalized)
    || /\.(test|spec)\.[jt]sx?$/.test(normalized)
    || /\.stories\.[jt]sx?$/.test(normalized);
}

function listSourceFiles(dir) {
  const result = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      result.push(...listSourceFiles(full));
      continue;
    }
    if (SOURCE_EXTENSIONS.has(path.extname(entry.name)) && !isExcludedFile(full)) {
      result.push(full);
    }
  }
  return result;
}

function propertyName(node, sourceFile) {
  if (!node) return '';
  if (ts.isIdentifier(node) || ts.isStringLiteral(node) || ts.isNumericLiteral(node)) {
    return node.text;
  }
  return node.getText(sourceFile).replace(/^['"]|['"]$/g, '');
}

function isUiFacingString(node, sourceFile) {
  if (!CYRILLIC.test(node.text)) return false;
  const parent = node.parent;

  if (ts.isImportDeclaration(parent) || ts.isExportDeclaration(parent)) return false;
  if (ts.isPropertyAssignment(parent) && parent.name === node) return false;

  if (ts.isJsxAttribute(parent)) {
    return UI_JSX_ATTRIBUTES.has(parent.name.getText(sourceFile));
  }

  if (ts.isPropertyAssignment(parent)) {
    return UI_PROPERTY_KEYS.has(propertyName(parent.name, sourceFile));
  }

  if (ts.isVariableDeclaration(parent)) {
    return UI_VARIABLE_NAME.test(parent.name.getText(sourceFile));
  }

  return false;
}

const candidates = [];
const seenLocations = new Set();

for (const file of listSourceFiles(ROOT)) {
  const source = fs.readFileSync(file, 'utf8');
  const scriptKind = file.endsWith('.tsx') || file.endsWith('.jsx')
    ? ts.ScriptKind.TSX
    : ts.ScriptKind.TS;
  const sourceFile = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, scriptKind);

  function addCandidate(start, end, text, kind) {
    const trimmed = text.trim();
    if (!trimmed || !CYRILLIC.test(trimmed)) return;
    const location = `${file}:${start}:${end}`;
    if (seenLocations.has(location)) return;
    seenLocations.add(location);
    candidates.push({ file, start, end, text, kind });
  }

  function visit(node) {
    // Text literally rendered between JSX tags is presentation copy.
    if (ts.isJsxText(node) && CYRILLIC.test(node.getText(sourceFile))) {
      addCandidate(node.getStart(sourceFile), node.getEnd(), node.getText(sourceFile), 'jsx');
    } else if (
      (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node))
      && isUiFacingString(node, sourceFile)
    ) {
      const kind = ts.isJsxAttribute(node.parent) ? 'jsx-attr' : 'string';
      addCandidate(node.getStart(sourceFile), node.getEnd(), node.text, kind);
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
}

const uniqueTexts = [...new Set(candidates.map(candidate => candidate.text.trim()))];
console.log(`UI candidates: ${candidates.length} occurrences / ${uniqueTexts.length} unique strings`);

function maskCodeTokens(input) {
  let index = 0;
  const tokens = [];
  const patterns = [
    /\$\{[^}]*\}/g,
    /\{[A-Za-z_][A-Za-z0-9_.-]*\}/g,
    /https?:\/\/[^\s]+/g,
    /@[A-Za-z0-9_]+/g,
    /\/[A-Za-z][A-Za-z0-9_-]*/g,
    /\\[nrt'"`\\]/g,
    /<\/?[A-Za-z][^>]*>/g,
  ];

  let value = input;
  for (const pattern of patterns) {
    value = value.replace(pattern, match => {
      const token = `__BOTCRAFT_MASK_${index++}__`;
      tokens.push([token, match]);
      return token;
    });
  }
  return { value, tokens };
}

function restoreCodeTokens(input, tokens) {
  let value = input;
  for (const [token, original] of tokens) {
    value = value.split(token).join(original);
  }
  return value;
}

async function translateOne(text) {
  const masked = maskCodeTokens(text);
  const url = `${TRANSLATE_ENDPOINT}?client=gtx&sl=ru&tl=en&dt=t&q=${encodeURIComponent(masked.value)}`;
  let lastError;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const translated = Array.isArray(data?.[0])
        ? data[0].map(part => Array.isArray(part) ? (part[0] || '') : '').join('')
        : '';
      if (!translated) throw new Error('Empty translation response');
      return restoreCodeTokens(translated, masked.tokens);
    } catch (error) {
      lastError = error;
      await new Promise(resolve => setTimeout(resolve, attempt * 350));
    }
  }

  throw lastError;
}

const translations = new Map();
let cursor = 0;
let completed = 0;
let failures = 0;

async function translationWorker() {
  while (true) {
    const index = cursor++;
    if (index >= uniqueTexts.length) return;

    const source = uniqueTexts[index];
    try {
      translations.set(source, await translateOne(source));
    } catch (error) {
      failures++;
      translations.set(source, source);
      console.warn(`Skipped translation: ${source.slice(0, 100)} :: ${error?.message || error}`);
    }

    completed++;
    if (completed % 100 === 0 || completed === uniqueTexts.length) {
      console.log(`Translated ${completed}/${uniqueTexts.length}; failed=${failures}`);
    }
  }
}

await Promise.all(Array.from({ length: CONCURRENCY }, () => translationWorker()));

const editsByFile = new Map();
for (const candidate of candidates) {
  if (!editsByFile.has(candidate.file)) editsByFile.set(candidate.file, []);
  editsByFile.get(candidate.file).push(candidate);
}

let changedFiles = 0;
let changedStrings = 0;

for (const [file, edits] of editsByFile) {
  let source = fs.readFileSync(file, 'utf8');
  const sorted = edits.sort((a, b) => b.start - a.start);
  let changed = false;

  for (const edit of sorted) {
    const originalKey = edit.text.trim();
    let translated = translations.get(originalKey);
    if (!translated || translated === originalKey || CYRILLIC.test(translated)) continue;

    if (edit.kind === 'jsx') {
      const leading = edit.text.match(/^\s*/)?.[0] || '';
      const trailing = edit.text.match(/\s*$/)?.[0] || '';
      translated = `${leading}${translated.trim()}${trailing}`;
    } else if (edit.kind === 'jsx-attr') {
      // Quoted JSX attributes cannot use JavaScript backslash escaping.
      // Use an expression container so quotes/newlines are encoded safely.
      translated = `{${JSON.stringify(translated)}}`;
    } else {
      translated = JSON.stringify(translated);
    }

    source = source.slice(0, edit.start) + translated + source.slice(edit.end);
    changed = true;
    changedStrings++;
  }

  if (changed) {
    fs.writeFileSync(file, source, 'utf8');
    changedFiles++;
  }
}

console.log(`Changed ${changedStrings} UI strings in ${changedFiles} files; translation failures=${failures}`);
