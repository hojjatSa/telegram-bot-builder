import fs from 'node:fs';

const checks = [
  {
    file: 'server/routes/auth/handlers/telegramAuthHandler.ts',
    needles: ['getGolnoorUserAccess', 'ensureGolnoorAccessControlSchema'],
  },
  {
    file: 'server/routes/auth/handlers/meHandler.ts',
    needles: ['getGolnoorUserAccess'],
  },
  {
    file: 'server/telegram/auth-middleware.ts',
    needles: ['getGolnoorUserAccess'],
  },
  {
    file: 'server/fork/index.ts',
    needles: ['registerGolnoorAccessControlRoutes'],
  },
  {
    file: 'client/components/admin/pages/admin-users.tsx',
    needles: ['AdminAccessControlPanel'],
  },
  {
    file: 'docker-compose.yml',
    needles: ['GOLNOOR_ACCESS_CONTROL_ENABLED'],
  },
];

const failures = [];

for (const check of checks) {
  if (!fs.existsSync(check.file)) {
    failures.push(`${check.file}: file missing`);
    continue;
  }

  const source = fs.readFileSync(check.file, 'utf8');
  for (const needle of check.needles) {
    if (!source.includes(needle)) {
      failures.push(`${check.file}: missing integration marker ${needle}`);
    }
  }
}

if (failures.length > 0) {
  console.error('Golnoor access-control compatibility check FAILED');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Golnoor access-control compatibility check PASSED');
