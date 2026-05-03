import type { Config } from 'tailwindcss';

// Once `pnpm tokens:build` runs, replace these literals with imports from
// '@kardyx/tokens/tailwind' to keep web and mobile in lockstep.

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: '#FAF6EC',
        'paper-deep': '#F2EDE0',
        mist: '#E8E2D4',
        ink: '#1A1714',
        'ink-soft': '#3A332A',
        slate: '#6B7280',
        ochre: '#C18A4A',
        clay: '#C04A1A',
        'clay-deep': '#8C3210',
        verdigris: '#2A5550',
      },
      fontFamily: {
        display: ['var(--font-display)', 'ui-serif', 'Georgia', 'serif'],
        body: ['var(--font-display)', 'ui-serif', 'Georgia', 'serif'],
        ui: ['var(--font-ui)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      transitionTimingFunction: {
        'settle-stamp': 'cubic-bezier(0.22, 0.6, 0.2, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
