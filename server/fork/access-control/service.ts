export type GolnoorAccessStatus = 'pending' | 'allowed' | 'blocked';

export interface GolnoorAccessDecision {
  status: GolnoorAccessStatus;
  allowed: boolean;
}

export interface GolnoorAccessUser {
  id: string;
  firstName: string;
  lastName: string | null;
  username: string | null;
  photoUrl: string | null;
  createdAt: string | null;
  status: GolnoorAccessStatus;
  accessUpdatedAt: string | null;
}

const ACCESS_TABLE = 'golnoor_user_access';
const SCHEMA_LOCK_KEY = 24090401;
const CACHE_TTL_MS = 15_000;

let schemaReadyPromise: Promise<void> | null = null;
const accessCache = new Map<number, { status: GolnoorAccessStatus; expiresAt: number }>();

function parseBoolean(value: string | undefined): boolean | null {
  if (value == null || value.trim() === '') return null;
  const normalized = value.trim().toLowerCase();
  if (['1', 'true', 'yes', 'on'].includes(normalized)) return true;
  if (['0', 'false', 'no', 'off'].includes(normalized)) return false;
  return null;
}

/**
 * Access control is on by default in production on the Golnoor branch.
 * It can be disabled temporarily through Coolify as an emergency escape hatch.
 */
export function isGolnoorAccessControlEnabled(): boolean {
  const explicit = parseBoolean(process.env.GOLNOOR_ACCESS_CONTROL_ENABLED);
  if (explicit !== null) return explicit;
  return process.env.NODE_ENV === 'production';
}

async function getPool() {
  const { pool } = await import('../../database/db');
  return pool;
}

async function initializeSchema(): Promise<void> {
  const pool = await getPool();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    await client.query('SELECT pg_advisory_xact_lock($1)', [SCHEMA_LOCK_KEY]);

    const existing = await client.query<{ table_name: string | null }>(
      `SELECT to_regclass('public.${ACCESS_TABLE}')::text AS table_name`,
    );
    const tableAlreadyExisted = Boolean(existing.rows[0]?.table_name);

    await client.query(`
      CREATE TABLE IF NOT EXISTS ${ACCESS_TABLE} (
        telegram_user_id BIGINT PRIMARY KEY REFERENCES telegram_users(id) ON DELETE CASCADE,
        status TEXT NOT NULL DEFAULT 'pending'
          CHECK (status IN ('pending', 'allowed', 'blocked')),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_by TEXT NOT NULL DEFAULT 'system'
      )
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_${ACCESS_TABLE}_status
      ON ${ACCESS_TABLE}(status)
    `);

    // First deployment safety: users that had already signed in before this
    // feature existed keep access. Only users first seen after this table is
    // created start as pending.
    if (!tableAlreadyExisted) {
      await client.query(`
        INSERT INTO ${ACCESS_TABLE}
          (telegram_user_id, status, created_at, updated_at, updated_by)
        SELECT id, 'allowed', NOW(), NOW(), 'bootstrap-existing-user'
        FROM telegram_users
        ON CONFLICT (telegram_user_id) DO NOTHING
      `);
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK').catch(() => undefined);
    throw error;
  } finally {
    client.release();
  }
}

export function ensureGolnoorAccessControlSchema(): Promise<void> {
  if (!schemaReadyPromise) {
    schemaReadyPromise = initializeSchema().catch((error) => {
      schemaReadyPromise = null;
      throw error;
    });
  }
  return schemaReadyPromise;
}

function normalizeStatus(value: unknown): GolnoorAccessStatus {
  if (value === 'allowed' || value === 'blocked') return value;
  return 'pending';
}

export async function getGolnoorUserAccess(
  userId: number,
  options: { createIfMissing?: boolean; bypassCache?: boolean } = {},
): Promise<GolnoorAccessDecision> {
  if (!isGolnoorAccessControlEnabled()) {
    return { status: 'allowed', allowed: true };
  }

  const now = Date.now();
  if (!options.bypassCache) {
    const cached = accessCache.get(userId);
    if (cached && cached.expiresAt > now) {
      return { status: cached.status, allowed: cached.status === 'allowed' };
    }
  }

  await ensureGolnoorAccessControlSchema();
  const pool = await getPool();

  if (options.createIfMissing !== false) {
    await pool.query(
      `
        INSERT INTO ${ACCESS_TABLE}
          (telegram_user_id, status, created_at, updated_at, updated_by)
        VALUES ($1, 'pending', NOW(), NOW(), 'first-login')
        ON CONFLICT (telegram_user_id) DO NOTHING
      `,
      [userId],
    );
  }

  const result = await pool.query<{ status: string }>(
    `SELECT status FROM ${ACCESS_TABLE} WHERE telegram_user_id = $1`,
    [userId],
  );

  const status = normalizeStatus(result.rows[0]?.status);
  accessCache.set(userId, { status, expiresAt: now + CACHE_TTL_MS });
  return { status, allowed: status === 'allowed' };
}

export async function setGolnoorUserAccess(
  userId: number,
  status: GolnoorAccessStatus,
): Promise<GolnoorAccessDecision> {
  await ensureGolnoorAccessControlSchema();
  const pool = await getPool();

  const userExists = await pool.query('SELECT 1 FROM telegram_users WHERE id = $1', [userId]);
  if (userExists.rowCount === 0) {
    const error = new Error('Telegram user not found');
    (error as Error & { code?: string }).code = 'USER_NOT_FOUND';
    throw error;
  }

  await pool.query(
    `
      INSERT INTO ${ACCESS_TABLE}
        (telegram_user_id, status, created_at, updated_at, updated_by)
      VALUES ($1, $2, NOW(), NOW(), 'admin')
      ON CONFLICT (telegram_user_id)
      DO UPDATE SET status = EXCLUDED.status, updated_at = NOW(), updated_by = 'admin'
    `,
    [userId, status],
  );

  accessCache.delete(userId);
  return { status, allowed: status === 'allowed' };
}

export async function listGolnoorAccessUsers(): Promise<GolnoorAccessUser[]> {
  await ensureGolnoorAccessControlSchema();
  const pool = await getPool();
  const result = await pool.query<{
    id: string;
    first_name: string;
    last_name: string | null;
    username: string | null;
    photo_url: string | null;
    created_at: Date | string | null;
    status: string | null;
    access_updated_at: Date | string | null;
  }>(`
    SELECT
      u.id::text AS id,
      u.first_name,
      u.last_name,
      u.username,
      u.photo_url,
      u.created_at,
      COALESCE(a.status, 'pending') AS status,
      a.updated_at AS access_updated_at
    FROM telegram_users u
    LEFT JOIN ${ACCESS_TABLE} a ON a.telegram_user_id = u.id
    ORDER BY u.created_at DESC NULLS LAST, u.id DESC
    LIMIT 500
  `);

  const toIso = (value: Date | string | null): string | null => {
    if (!value) return null;
    const date = value instanceof Date ? value : new Date(value);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  };

  return result.rows.map((row) => ({
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    username: row.username,
    photoUrl: row.photo_url,
    createdAt: toIso(row.created_at),
    status: normalizeStatus(row.status),
    accessUpdatedAt: toIso(row.access_updated_at),
  }));
}

export function clearGolnoorAccessCache(userId?: number): void {
  if (typeof userId === 'number') {
    accessCache.delete(userId);
    return;
  }
  accessCache.clear();
}

export function accessDeniedPayload(status: GolnoorAccessStatus) {
  if (status === 'blocked') {
    return {
      code: 'ACCESS_BLOCKED',
      error: 'Access to this account has been blocked by the administrator.',
    };
  }
  return {
    code: 'ACCESS_PENDING',
    error: 'Your account is waiting for administrator approval.',
  };
}
