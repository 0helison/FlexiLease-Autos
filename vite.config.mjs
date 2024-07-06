import dotenv from 'dotenv';
import swc from 'unplugin-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

dotenv.config({ path: '.env.test' });

export const userConfig = {
  plugins: [
    tsconfigPaths(),
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
  test: {
    globals: true,
    environment: 'node',
    retry: 3,
    root: './',
    coverage: {
      exclude: [
        '**/*index.ts',
        'swagger.ts',
        '**/*server.ts',
        '**/*.config.mjs',
      ],
    },
    testTimeout: 100000,
  },
};

export default defineConfig(userConfig);
