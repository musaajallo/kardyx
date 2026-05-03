import type {
  PaymentEvent,
  PaymentProvider,
  PaymentRequest,
  PaymentSession,
  PaymentStatus,
  RefundOptions,
  RefundResult,
} from '../PaymentProvider.js';

export interface WaychitConfig {
  apiKey: string;
  apiUrl: string;
  webhookSecret: string;
}

export class WaychitProvider implements PaymentProvider {
  readonly name = 'waychit';
  readonly supportedCurrencies = ['GMD'] as const;
  readonly supportedRegions = ['GM'] as const;

  constructor(_config: WaychitConfig) {}

  async initiate(_req: PaymentRequest): Promise<PaymentSession> {
    throw new Error('WaychitProvider.initiate — not yet implemented (Phase 3)');
  }

  async verifyWebhook(_headers: Headers, _rawBody: Buffer): Promise<PaymentEvent> {
    throw new Error('WaychitProvider.verifyWebhook — not yet implemented (Phase 3)');
  }

  async getStatus(_paymentId: string): Promise<PaymentStatus> {
    throw new Error('WaychitProvider.getStatus — not yet implemented (Phase 3)');
  }

  async refund(_paymentId: string, _opts?: RefundOptions): Promise<RefundResult> {
    throw new Error('WaychitProvider.refund — not yet implemented (Phase 3)');
  }
}
