// Card recognition contracts. Implementations live in the platform-specific
// packages (TFLite native on mobile via react-native-fast-tflite, TF.js on web PWA).

import type { Card } from '@kardyx/types';

/** A frame of pixel data, abstracted across platforms. */
export interface Frame {
  width: number;
  height: number;
  /** RGBA byte buffer. Length must equal width * height * 4. */
  data: Uint8Array | Uint8ClampedArray;
}

export interface CardRecognition {
  card: Card;
  confidence: number; // 0..1
  boundingBox?: { x: number; y: number; width: number; height: number };
  durationMs: number;
}

export interface CardRecognizer {
  recognize(input: Frame): Promise<CardRecognition | null>;
  warmUp?(): Promise<void>;
  dispose?(): void;
}
