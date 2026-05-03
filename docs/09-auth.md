# 9. Authentication & Account Security

> **Decision:** Self-hosted auth. No vendor (Clerk, Auth0, Supabase). Full control over data, no per-MAU pricing, and resilience to vendor pivots.

## Stack

| Component             | Choice                                  |
| --------------------- | --------------------------------------- |
| Auth library          | **Lucia Auth** (TypeScript, no vendor)  |
| Password hashing      | **Argon2id** (`@node-rs/argon2`)        |
| 2FA                   | **TOTP** via `otplib`                   |
| Backup codes          | 10 single-use codes (hashed at rest)    |
| Session storage       | PostgreSQL (sessions table)             |
| Rate limiting         | `@fastify/rate-limit` + Redis backend   |
| Email delivery        | Resend (transactional)                  |
| Optional Phase 5      | WebAuthn / Passkeys                     |

## Account Lifecycle

```
Sign up → Email verify → (Optional 2FA enroll) → Active
                                  │
                                  ▼
        Password reset via email magic link
                                  │
                                  ▼
        Session refresh / logout / revoke all sessions
```

## Sign-Up Flow

1. User submits email + password
2. Validate password strength (min 12 chars, zxcvbn score ≥ 3)
3. Hash with Argon2id (memory: 64 MB, iterations: 3, parallelism: 4)
4. Create user record + send verification email (Resend, 24h token)
5. User clicks link → email marked verified
6. Prompt 2FA enrollment (recommended, not forced at MVP)

## 2FA Enrollment (TOTP)

1. Generate TOTP secret (`otplib.authenticator.generateSecret()`)
2. Display QR code (`otpauth://` URI) for Google Authenticator / Authy / 1Password
3. User enters a 6-digit code to confirm setup
4. On success:
   - Persist encrypted TOTP secret
   - Generate **10 backup codes** (random 10-char alphanumeric, hashed before storage)
   - Show backup codes once with download/copy options
5. Future logins require password + TOTP code

## Login Flow

```
POST /auth/login { email, password }
  │
  ├─ Argon2id verify
  ├─ Rate limit check (5 attempts / 15 min per IP + per email)
  ├─ If 2FA enabled → 200 { challenge: "totp" }
  └─ Else → 200 { session: <token> }

POST /auth/login/2fa { challenge_id, code }
  │
  ├─ Verify TOTP within ±1 step (30s window)
  ├─ Or verify backup code (single-use, mark consumed)
  └─ 200 { session: <token> }
```

## Session Management

- **Web:** session token in HTTP-only, Secure, SameSite=Lax cookie
- **Mobile:** session token in Expo SecureStore (Keychain / Keystore)
- **TTL:** 30 days, sliding expiration on activity
- **Idle timeout:** 14 days of inactivity invalidates the session
- **Concurrent sessions:** allowed (multi-device); user can list and revoke individually
- **Revocation:** admin endpoint to revoke all sessions for a user (e.g., after password change)

## Password Reset

1. User requests reset → email with single-use token (1h TTL)
2. Token validates → user sets new password (same strength rules)
3. **All existing sessions revoked** on successful reset
4. Audit log entry created

## Rate Limiting Rules

| Endpoint           | Limit                              |
| ------------------ | ---------------------------------- |
| `/auth/login`      | 5/15min per IP, 10/hr per email    |
| `/auth/2fa/verify` | 5/15min per session                |
| `/auth/signup`     | 3/hr per IP                        |
| `/auth/reset`      | 3/hr per email                     |
| Generic API        | 100/min per session                |

Backed by Redis sliding-window counters.

## Audit Log

Every security-relevant event written to `audit_log` table:

```sql
CREATE TABLE audit_log (
  id UUID PRIMARY KEY,
  user_id UUID,
  event_type TEXT NOT NULL,        -- login.success, login.failure, 2fa.enrolled, password.changed, etc.
  ip_address INET,
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_audit_user ON audit_log (user_id, created_at DESC);
```

User-facing security page in the app shows their recent activity from this log.

## LAN Mode Auth

Offline LAN play needs lightweight pairing without server round-trip:

- Host displays a **6-digit pairing code** on screen
- Peers enter the code to join the session
- Host signs a short-lived LAN session token (HMAC with rotating key) and sends to peer
- Token only authorizes actions within that LAN session — no cloud privileges
- When host regains connectivity, session results upload using the host's normal auth

## Threat Model & Mitigations

| Threat                     | Mitigation                                                       |
| -------------------------- | ---------------------------------------------------------------- |
| Credential stuffing        | Rate limiting + 2FA + breach-password check (HIBP API)           |
| Session token theft        | HTTP-only + Secure cookies; rotate on privilege change           |
| TOTP secret leak           | Encrypted at rest with separate KMS key (env var)                |
| Phishing / fake QR codes   | Email-based verification before 2FA changes                      |
| Account takeover via email | Reset emails sent to verified address only; backup code recovery |
| Brute-force backup codes   | Rate-limited; codes are 10-char base32, hashed                   |
| Insider DB access          | Argon2id (no plaintext); TOTP secrets encrypted; audit logging   |

## Data Retention

- **Sessions:** deleted on logout or 30-day expiry
- **Audit log:** retained 1 year, then aggregated and pruned
- **Deleted accounts:** soft-delete for 30 days (recovery window), then hard-delete + audit-log scrubbing

## Optional Phase 5 — WebAuthn / Passkeys

- Hardware key + biometric login
- `@simplewebauthn/server` + `@simplewebauthn/browser` (web) / native modules (mobile)
- Allows passwordless flows once 2FA-enrolled
- Strong protection against phishing
