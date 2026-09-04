import type { Express } from 'express';
import { requireAdminAuth } from '../../admin/admin-auth-middleware';
import {
  isGolnoorAccessControlEnabled,
  listGolnoorAccessUsers,
  setGolnoorUserAccess,
  type GolnoorAccessStatus,
} from './service';

const VALID_STATUSES = new Set<GolnoorAccessStatus>(['pending', 'allowed', 'blocked']);

export function registerGolnoorAccessControlRoutes(app: Express): void {
  app.get(
    '/admin/api/fork/access-control/users',
    requireAdminAuth,
    async (_req, res) => {
      res.setHeader('Cache-Control', 'no-store');
      try {
        const users = await listGolnoorAccessUsers();
        res.json({
          enabled: isGolnoorAccessControlEnabled(),
          users,
        });
      } catch (error) {
        console.error(
          '[Fork/AccessControl] list failed:',
          error instanceof Error ? error.message : error,
        );
        res.status(500).json({
          error: 'ACCESS_CONTROL_LIST_FAILED',
        });
      }
    },
  );

  app.patch(
    '/admin/api/fork/access-control/users/:id',
    requireAdminAuth,
    async (req, res) => {
      res.setHeader('Cache-Control', 'no-store');

      const userId = Number(req.params.id);
      const status = req.body?.status as GolnoorAccessStatus | undefined;

      if (!Number.isSafeInteger(userId) || userId <= 0) {
        res.status(400).json({ error: 'INVALID_TELEGRAM_USER_ID' });
        return;
      }
      if (!status || !VALID_STATUSES.has(status)) {
        res.status(400).json({ error: 'INVALID_ACCESS_STATUS' });
        return;
      }

      try {
        const decision = await setGolnoorUserAccess(userId, status);
        res.json({ success: true, userId, ...decision });
      } catch (error) {
        const code = error instanceof Error
          ? (error as Error & { code?: string }).code
          : undefined;
        if (code === 'USER_NOT_FOUND') {
          res.status(404).json({ error: 'TELEGRAM_USER_NOT_FOUND' });
          return;
        }

        console.error(
          '[Fork/AccessControl] update failed:',
          error instanceof Error ? error.message : error,
        );
        res.status(500).json({ error: 'ACCESS_CONTROL_UPDATE_FAILED' });
      }
    },
  );
}
