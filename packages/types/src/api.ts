export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ApiError };

export interface HealthResponse {
  status: 'ok' | 'degraded' | 'down';
  uptime: number;
  version: string;
  checks: {
    database: 'ok' | 'down';
    redis: 'ok' | 'down';
  };
}
