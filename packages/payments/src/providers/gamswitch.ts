import type {
  PaymentEvent,
  PaymentProvider,
  PaymentRequest,
  PaymentSession,
  PaymentStatus,
  RefundOptions,
  RefundResult,
} from '../PaymentProvider.js';

export interface GamSwitchConfig {
  apiKey: string;
  apiUrl: string;
  webhookSecret: string;
}

export class GamSwitchProvider implements PaymentProvider {
  readonly name = 'gamswitch';
  readonly supportedCurrencies = ['GMD'] as const;
  readonly supportedRegions = ['GM'] as const;

  constructor(_config: GamSwitchConfig) {}

  async initiate(_req: PaymentRequest): Promise<PaymentSession> {
    throw new Error('GamSwitchProvider.initiate — not yet implemented (Phase 3)');
  }
  async verifyWebhook(_headers: Headers, _rawBody: Buffer): Promise<PaymentEvent> {
    throw new Error('GamSwitchProvider.verifyWebhook — not yet implemented (Phase 3)');
  }
  async getStatus(_paymentId: string): Promise<PaymentStatus> {
    throw new Error('GamSwitchProvider.getStatus — not yet implemented (Phase 3)');
  }
  async refund(_paymentId: string, _opts?: RefundOptions): Promise<RefundResult> {
    throw new Error('GamSwitchProvider.refund — not yet implemented (Phase 3)');
  }
}
