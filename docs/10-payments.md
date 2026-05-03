# 10. Payments & Mobile Money Integration

> **Strategy:** Mobile-money-first for The Gambia (Phase 1), expanding to regional providers (Phase 5). Card payments deferred until international demand justifies the complexity.

## Provider Roster

### Phase 1 — The Gambia

| Provider        | Type             | Notes                                          |
| --------------- | ---------------- | ---------------------------------------------- |
| **Waychit**     | Wallet / mobile  | Local Gambian fintech                          |
| **Modern Pay**  | Wallet / mobile  | Local Gambian fintech                          |
| **GamSwitch**   | Card / interbank | Connects to local bank cards                   |

### Phase 5 — Regional Expansion

| Provider           | Region                              |
| ------------------ | ----------------------------------- |
| **Wave**           | Senegal, Côte d'Ivoire, Mali, etc.  |
| **Orange Money**   | West / Central Africa               |
| **MTN MoMo**       | Multi-country                       |
| **Stripe**         | Card / global (when justified)      |

## Architecture

```
packages/payments/
├── PaymentProvider.ts        # Common interface
├── types.ts                  # PaymentRequest, PaymentEvent, etc.
├── providers/
│   ├── waychit.ts
│   ├── modern-pay.ts
│   ├── gamswitch.ts
│   ├── wave.ts               (Phase 5)
│   ├── orange-money.ts       (Phase 5)
│   ├── mtn-momo.ts           (Phase 5)
│   └── stripe.ts             (Phase 5)
├── webhooks/
│   ├── verify.ts             # Per-provider signature verification
│   └── handlers.ts           # Routes events to entitlement service
└── entitlement/
    └── grant.ts              # Maps successful payments to content unlocks
```

## Common Provider Interface

```ts
export interface PaymentProvider {
  readonly name: string;
  readonly supportedCurrencies: readonly string[];
  readonly supportedRegions: readonly string[];

  initiate(req: PaymentRequest): Promise<PaymentSession>;
  verifyWebhook(headers: Headers, rawBody: Buffer): Promise<PaymentEvent>;
  getStatus(paymentId: string): Promise<PaymentStatus>;
  refund(paymentId: string, opts?: RefundOptions): Promise<RefundResult>;
}

export interface PaymentRequest {
  userId: string;
  productId: string;          // e.g., "deck.kardyx_origins"
  amount: number;             // In minor units (cents/bututs)
  currency: string;           // ISO 4217 (GMD, USD, XOF)
  metadata?: Record<string, string>;
  idempotencyKey: string;
}

export interface PaymentSession {
  paymentId: string;
  redirectUrl?: string;       // For browser-based flows
  ussdCode?: string;          // For USSD push (some mobile money)
  qrPayload?: string;         // For QR-based flows
  expiresAt: Date;
}

export interface PaymentEvent {
  paymentId: string;
  status: "pending" | "succeeded" | "failed" | "refunded";
  amount: number;
  currency: string;
  providerReference: string;
  occurredAt: Date;
}
```

## Payment Flow

```
┌─────────────┐    1. select product + region          ┌──────────────┐
│   Client    │ ─────────────────────────────────────▶ │   API        │
│ (Web / RN)  │                                        │  /payments   │
└─────────────┘                                        └──────┬───────┘
                                                              │
                                                              ▼
                                                    ┌──────────────────┐
                                                    │ PaymentProvider  │
                                                    │ (resolved by     │
                                                    │  region/choice)  │
                                                    └────────┬─────────┘
                                                              │
                                                              ▼
                                                    ┌──────────────────┐
                                                    │  Mobile money    │
                                                    │  provider API    │
                                                    └────────┬─────────┘
                                                              │
        ┌─────────────────────────────────────────────────────┘
        │   2. payment instructions / redirect / USSD push
        ▼
┌─────────────┐
│   Client    │  user completes payment on their wallet app
└─────────────┘
                                                              │
                                                              ▼
                                                    ┌──────────────────┐
                                                    │  Provider sends  │
                                                    │  webhook         │
                                                    └────────┬─────────┘
                                                              │
                                                              ▼
                                                    ┌──────────────────┐
                                                    │ /webhooks/{prov} │
                                                    │ verify signature │
                                                    │ → grant access   │
                                                    └──────────────────┘
```

## Idempotency

- Every `initiate()` call **must** include an `idempotencyKey` (UUID v4 generated client-side)
- Backend stores `(idempotencyKey → paymentId)` in Postgres for 24h
- Replays return the original `PaymentSession` instead of creating a new charge

## Webhook Security

Each provider verifies differently. Common rules:

- **HTTPS only**, with TLS pinning where the provider supports it
- **Signature verification** before any DB write
- **Replay protection** — idempotency keys + timestamp window (5 min skew tolerance)
- **Allowlist** of provider IPs at the WAF / Cloudflare layer
- **Webhook events stored** in `payment_webhook_events` table for audit and replay
- **Failed webhooks** queued for retry (BullMQ, exponential backoff, 7-day max)

## Database Schema (Sketch)

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  provider TEXT NOT NULL,
  provider_reference TEXT,
  product_id TEXT NOT NULL,
  amount_minor BIGINT NOT NULL,
  currency CHAR(3) NOT NULL,
  status TEXT NOT NULL,
  idempotency_key UUID UNIQUE NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_payments_user ON payments (user_id, created_at DESC);
CREATE INDEX idx_payments_status ON payments (status);

CREATE TABLE entitlements (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  product_id TEXT NOT NULL,
  payment_id UUID REFERENCES payments(id),
  granted_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,         -- NULL for permanent unlocks
  UNIQUE (user_id, product_id)
);

CREATE TABLE payment_webhook_events (
  id UUID PRIMARY KEY,
  provider TEXT NOT NULL,
  raw_payload JSONB NOT NULL,
  signature TEXT,
  signature_valid BOOLEAN NOT NULL,
  payment_id UUID REFERENCES payments(id),
  processed_at TIMESTAMPTZ,
  received_at TIMESTAMPTZ DEFAULT now()
);
```

## Entitlement Service

When a payment succeeds:

1. Webhook handler verifies signature
2. Looks up `payment_id` from provider reference
3. Updates `payments.status = 'succeeded'`
4. Inserts row in `entitlements` for the purchased product
5. Emits `entitlement.granted` event → notifies client to unlock content
6. Cached entitlement set in Redis for fast access checks

Offline clients sync entitlements on next connect; owned content cached locally.

## Refunds

- Admin-only endpoint: `POST /admin/payments/:id/refund`
- Calls `provider.refund()` with original payment ID
- On success: revoke entitlement, send user notification, write audit log entry
- Partial refunds supported where provider allows

## Tax & Compliance

- **VAT / sales tax:** out of scope for MVP; add when revenue threshold requires
- **AML / KYC:** rely on provider compliance for Phase 1; revisit when transaction volume exceeds local thresholds
- **PCI scope:** **zero card data ever touches our servers** — all card flows redirect to provider
- **Receipts:** auto-emailed by provider; we mirror to user's account history

## Currency Strategy

- Display prices in user's local currency (GMD primary, XOF, NGN, USD)
- Store `amount_minor` in transaction currency — never convert at write time
- Convert for global ranking displays only (use ECB rates, refreshed daily)

## Pricing Model (Initial)

| Product                     | Price (GMD est.) |
| --------------------------- | ---------------- |
| Premium deck                | 200–500          |
| Character pack              | 100–300          |
| Tournament entry            | 50–200           |
| Custom card mint            | 100              |
| Subscription (Phase 5)      | 200/month        |

Numbers are placeholders — adjust after market research and unit economics.
