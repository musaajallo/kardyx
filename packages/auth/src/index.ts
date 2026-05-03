// Self-hosted auth scaffold (Lucia + TOTP 2FA + Argon2id).
// Real implementation lands in Phase 1 — see docs/09-auth.md.
//
// This module will export:
//   - createAuth(config): Lucia instance bound to Postgres adapter
//   - hashPassword / verifyPassword (Argon2id)
//   - enrollTotp / verifyTotp (otplib)
//   - generateBackupCodes / verifyBackupCode
//   - rate-limit middleware factories
//
// Until Phase 1 lands, this is a typed placeholder so other packages can import the contract.

export interface AuthConfig {
  databaseUrl: string;
  redisUrl: string;
  sessionSecret: string;
  argon2: {
    memoryCost: number;
    timeCost: number;
    parallelism: number;
  };
}

export interface AuthSession {
  id: string;
  userId: string;
  expiresAt: Date;
  twoFactorVerified: boolean;
}

export interface User {
  id: string;
  email: string;
  emailVerifiedAt: Date | null;
  twoFactorEnrolledAt: Date | null;
  createdAt: Date;
}

export const PLACEHOLDER = 'See docs/09-auth.md for the full spec.';
