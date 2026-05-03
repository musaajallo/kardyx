export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'refunded';

export interface PaymentRequest {
  userId: string;
  productId: string;
  amount: number; // minor units (bututs/cents)
  currency: string; // ISO 4217 — e.g., 'GMD', 'USD', 'XOF'
  metadata?: Record<string, string>;
  idempotencyKey: string;
}

export interface PaymentSession {
  paymentId: string;
  redirectUrl?: string;
  ussdCode?: string;
  qrPayload?: string;
  expiresAt: Date;
}

export interface PaymentEvent {
  paymentId: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
  providerReference: string;
  occurredAt: Date;
}

export interface RefundOptions {
  amount?: number; // partial refund support
  reason?: string;
}

export interface RefundResult {
  refundId: string;
  paymentId: string;
  amount: number;
  occurredAt: Date;
}

export interface PaymentProvider {
  readonly name: string;
  readonly supportedCurrencies: readonly string[];
  readonly supportedRegions: readonly string[];

  initiate(req: PaymentRequest): Promise<PaymentSession>;
  verifyWebhook(headers: Headers, rawBody: Buffer): Promise<PaymentEvent>;
  getStatus(paymentId: string): Promise<PaymentStatus>;
  refund(paymentId: string, opts?: RefundOptions): Promise<RefundResult>;
}
