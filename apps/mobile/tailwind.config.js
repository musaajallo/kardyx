/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
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
        display: ['Newsreader'],
        body: ['Newsreader'],
        ui: ['Inter'],
        mono: ['JetBrainsMono'],
      },
    },
  },
  plugins: [],
};
