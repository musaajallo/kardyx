export interface AppConfig {
  host: string;
  port: number;
  env: 'development' | 'staging' | 'production';
  databaseUrl: string;
  redisUrl: string;
  authSecret: string;
}

export function loadConfig(): AppConfig {
  const env = (process.env.NODE_ENV ?? 'development') as AppConfig['env'];

  return {
    host: process.env.HOST ?? '0.0.0.0',
    port: Number.parseInt(process.env.PORT ?? '4000', 10),
    env,
    databaseUrl: required('DATABASE_URL', env === 'development' ? 'postgres://kardyx:kardyx@localhost:5432/kardyx' : ''),
    redisUrl: required('REDIS_URL', env === 'development' ? 'redis://localhost:6379' : ''),
    authSecret: required('AUTH_SECRET', env === 'development' ? 'dev-secret-change-me' : ''),
  };
}

function required(name: string, fallback: string): string {
  const v = process.env[name] ?? fallback;
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}
