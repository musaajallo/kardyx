import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kardyx',
  description: 'The cards in your hand are the interface. The game lives in the engine.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-paper text-ink font-body antialiased">{children}</body>
    </html>
  );
}
