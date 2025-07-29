import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  bundle: true,
  dts: false,
  splitting: false,
  external: ['stream', 'fs', 'path'], // avoid bundling Node-only code
  noExternal: ['hyperapp', 'hyperlit', 'hyper-styled'], // Force-bundle these packages
  outDir: 'dist',
});
