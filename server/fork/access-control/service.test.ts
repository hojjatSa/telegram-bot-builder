import assert from 'node:assert/strict';
import test from 'node:test';
import {
  accessDeniedPayload,
  isGolnoorAccessControlEnabled,
} from './service';

function withEnv(values: Record<string, string | undefined>, fn: () => void) {
  const previous = new Map<string, string | undefined>();
  for (const [key, value] of Object.entries(values)) {
    previous.set(key, process.env[key]);
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }

  try {
    fn();
  } finally {
    for (const [key, value] of previous) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
}

test('access control defaults to enabled in production', () => {
  withEnv(
    { NODE_ENV: 'production', GOLNOOR_ACCESS_CONTROL_ENABLED: undefined },
    () => assert.equal(isGolnoorAccessControlEnabled(), true),
  );
});

test('access control defaults to disabled outside production', () => {
  withEnv(
    { NODE_ENV: 'development', GOLNOOR_ACCESS_CONTROL_ENABLED: undefined },
    () => assert.equal(isGolnoorAccessControlEnabled(), false),
  );
});

test('explicit emergency override wins over NODE_ENV', () => {
  withEnv(
    { NODE_ENV: 'production', GOLNOOR_ACCESS_CONTROL_ENABLED: 'false' },
    () => assert.equal(isGolnoorAccessControlEnabled(), false),
  );
  withEnv(
    { NODE_ENV: 'development', GOLNOOR_ACCESS_CONTROL_ENABLED: 'true' },
    () => assert.equal(isGolnoorAccessControlEnabled(), true),
  );
});

test('denied payloads are stable for the client', () => {
  assert.deepEqual(accessDeniedPayload('pending'), {
    code: 'ACCESS_PENDING',
    error: 'Your account is waiting for administrator approval.',
  });
  assert.deepEqual(accessDeniedPayload('blocked'), {
    code: 'ACCESS_BLOCKED',
    error: 'Access to this account has been blocked by the administrator.',
  });
});
