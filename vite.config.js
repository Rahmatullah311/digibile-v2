import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Load environment variables for current mode
  const env = loadEnv(mode, process.cwd(), '');

  const PORT = Number(env.DEVELOPMENT_SERVER_PORT) || 5173;
  const HOST = env.DEVELOPMENT_SERVER_HOST || '0.0.0.0';

  return {
    plugins: [
      react(),
      checker({
        eslint: {
          useFlatConfig: true,
          lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"',
          dev: { logLevel: ['error'] },
        },
        overlay: {
          position: 'tl',
          initialIsOpen: false,
        },
      }),
    ],

    resolve: {
      alias: {
        src: path.resolve(process.cwd(), 'src'),
      },
    },

    server: {
      host: HOST, // or true
      port: PORT,
      strictPort: true,
    },

    preview: {
      host: HOST,
      port: PORT,
    },
  };
});
