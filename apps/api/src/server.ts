import Fastify, { type FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import sensible from '@fastify/sensible';
import rateLimit from '@fastify/rate-limit';
import type { AppConfig } from './config.js';
import { healthRoutes } from './routes/health.js';

export async function buildServer(config: AppConfig): Promise<FastifyInstance> {
  const server = Fastify({
    logger: {
      level: config.env === 'development' ? 'debug' : 'info',
      transport:
        config.env === 'development'
          ? { target: 'pino-pretty', options: { translateTime: 'HH:MM:ss', ignore: 'pid,hostname' } }
          : undefined,
    },
  });

  await server.register(helmet, { contentSecurityPolicy: config.env === 'production' });
  await server.register(cors, { origin: true, credentials: true });
  await server.register(sensible);
  await server.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });

  server.decorate('config', config);
  await server.register(healthRoutes);

  return server;
}

declare module 'fastify' {
  interface FastifyInstance {
    config: AppConfig;
  }
}
