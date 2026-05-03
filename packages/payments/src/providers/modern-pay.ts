import type {
  PaymentEvent,
  PaymentProvider,
  PaymentRequest,
  PaymentSession,
  PaymentStatus,
  RefundOptions,
  RefundResult,
} from '../PaymentProvider.js';

export interface ModernPayConfig {
  apiKey: string;
  apiUrl: string;
  webhookSecret: string;
}

export class ModernPayProvider implements PaymentProvider {
  readonly name = 'modern-pay';
  readonly supportedCurrencies = ['GMD'] as const;
  readonly supportedRegions = ['GM'] as const;

  constructor(_config: ModernPayConfig) {}

  async initiate(_req: PaymentRequest): Promise<PaymentSession> {
    throw new Error('ModernPayProvider.initiate — not yet implemented (Phase 3)');
  }
  async verifyWebhook(_headers: Headers, _rawBody: Buffer): Promise<PaymentEvent> {
    throw new Error('ModernPayProvider.verifyWebhook — not yet implemented (Phase 3)');
  }
  async getStatus(_paymentId: string): Promise<PaymentStatus> {
    throw new Error('ModernPayProvider.getStatus — not yet implemented (Phase 3)');
  }
  async refund(_paymentId: string, _opts?: RefundOptions): Promise<RefundResult> {
    throw new Error('ModernPayProvider.refund — not yet implemented (Phase 3)');
  }
}
