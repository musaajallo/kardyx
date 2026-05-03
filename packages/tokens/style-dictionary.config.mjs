import StyleDictionary from 'style-dictionary';

const sd = new StyleDictionary({
  source: ['src/tokens.json'],
  platforms: {
    tailwind: {
      transformGroup: 'js',
      buildPath: 'build/tailwind/',
      files: [
        {
          destination: 'tokens.js',
          format: 'javascript/esm',
        },
        {
          destination: 'tokens.d.ts',
          format: 'typescript/module-declarations',
        },
      ],
    },
    nativewind: {
      transformGroup: 'js',
      buildPath: 'build/nativewind/',
      files: [
        {
          destination: 'tokens.js',
          format: 'javascript/esm',
        },
        {
          destination: 'tokens.d.ts',
          format: 'typescript/module-declarations',
        },
      ],
    },
    web: {
      transformGroup: 'js',
      buildPath: 'build/web/',
      files: [
        {
          destination: 'tokens.js',
          format: 'javascript/esm',
        },
        {
          destination: 'tokens.d.ts',
          format: 'typescript/module-declarations',
        },
        {
          destination: 'tokens.css',
          format: 'css/variables',
          options: { selector: ':root' },
        },
      ],
    },
    figma: {
      transformGroup: 'js',
      buildPath: 'build/figma/',
      files: [
        {
          destination: 'tokens.json',
          format: 'json/flat',
        },
      ],
    },
  },
});

await sd.buildAllPlatforms();
console.log('✓ Tokens built — Tailwind, NativeWind, web (CSS+JS), Figma');
