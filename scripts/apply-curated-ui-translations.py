from __future__ import annotations

import ast
import re
from pathlib import Path

ROOT = Path('client')
WORKFLOWS = [
    (Path('.github/workflows/translate-editor-ui.yml'), 'string_pattern'),
    (Path('.github/workflows/translate-editor-ui-pass2.yml'), 'pattern'),
]


def load_translation_map(workflow: Path, next_marker: str) -> dict[str, str]:
    text = workflow.read_text(encoding='utf-8')
    start = text.index('translations = {')
    end = text.index(f'\n\n          {next_marker}', start)
    assignment = text[start:end]
    expression = assignment.split('=', 1)[1].strip()
    result = ast.literal_eval(expression)
    if not isinstance(result, dict):
        raise TypeError(f'Expected dict in {workflow}')
    return {str(key): str(value) for key, value in result.items()}


translations: dict[str, str] = {}
for workflow, marker in WORKFLOWS:
    current = load_translation_map(workflow, marker)
    translations.update(current)
    print(f'Loaded {len(current)} curated translations from {workflow}')

print(f'Total curated translations: {len(translations)}')

string_pattern = re.compile(r"(?P<q>['\"`])(?P<body>(?:\\.|(?!\1).)*?)(?P=q)", re.S)
extensions = {'.ts', '.tsx', '.js', '.jsx', '.html'}
changed_files: list[str] = []
replacement_count = 0

for path in ROOT.rglob('*'):
    if not path.is_file() or path.suffix not in extensions:
        continue
    path_text = str(path).replace('\\', '/')
    if '/tests/' in path_text or '/__tests__/' in path_text or '.test.' in path.name or '.spec.' in path.name:
        continue

    text = path.read_text(encoding='utf-8', errors='ignore')
    original = text

    def replace_string(match: re.Match[str]) -> str:
        global replacement_count
        body = match.group('body')
        translated = translations.get(body)
        if translated is None:
            return match.group(0)
        replacement_count += 1
        quote = match.group('q')
        return f'{quote}{translated}{quote}'

    text = string_pattern.sub(replace_string, text)

    # Translate literal JSX text between tags as well.
    for source, target in sorted(translations.items(), key=lambda item: -len(item[0])):
        if '<' in source or '>' in source:
            continue
        regex = re.compile(r'(>\s*)' + re.escape(source) + r'(\s*<)')
        text, count = regex.subn(lambda match, value=target: match.group(1) + value + match.group(2), text)
        replacement_count += count

    if text != original:
        path.write_text(text, encoding='utf-8')
        changed_files.append(str(path))

print(f'Applied {replacement_count} replacements across {len(changed_files)} files')
for changed in changed_files:
    print(changed)
