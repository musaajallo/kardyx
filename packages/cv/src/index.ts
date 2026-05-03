// Card recognition contracts. Implementations live in the platform-specific
// packages (TFLite native on mobile via react-native-fast-tflite, TF.js on web PWA).

import type { Card } from '@kardyx/types';

export interface CardRecognition {
  card: Card;
  confidence: number; // 0..1
  boundingBox?: { x: number; y: number; width: number; height: number };
  durationMs: number;
}

export interface CardRecognizer {
  recognize(input: ImageData | Uint8Array): Promise<CardRecognition | null>;
  warmUp?(): Promise<void>;
  dispose?(): void;
}
