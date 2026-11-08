import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { checker } from 'vite-plugin-checker';
import readableClassnames from 'vite-plugin-readable-classnames';
import sassDts from 'vite-plugin-sass-dts';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    checker({
      typescript: true,
      eslint: {
        useFlatConfig: true,  
        lintCommand: "eslint ."
      }
    }),
    react(),
    readableClassnames(),
    sassDts({
      enabledMode: ['development'],
      esmExport: true,
    }),
    tsconfigPaths(),
  ], 
  server: {
    open: true,
    proxy: {
  '/api/books': {
    target: 'https://gutendex.com',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api\/books/, '/books'),
  },
},
  },
}); 