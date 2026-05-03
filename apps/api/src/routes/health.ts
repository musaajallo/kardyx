import type { FastifyInstance } from 'fastify';
import type { HealthResponse } from '@kardyx/types';

const startedAt = Date.now();

export async function healthRoutes(server: FastifyInstance): Promise<void> {
  server.get('/health', async (): Promise<HealthResponse> => {
    return {
      status: 'ok',
      uptime: Math.floor((Date.now() - startedAt) / 1000),
      version: process.env.npm_package_version ?? '0.0.0',
      checks: {
        database: 'ok', // TODO Phase 1 — wire real Postgres ping
        redis: 'ok', // TODO Phase 1 — wire real Redis ping
      },
    };
  });

  server.get('/', async () => ({ name: 'Kardyx API', version: '0.0.0' }));
}
