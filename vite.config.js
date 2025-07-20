import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // default for Vite, AWS Amplify expects this
  },
  base: '/', // Make sure paths resolve correctly
});
