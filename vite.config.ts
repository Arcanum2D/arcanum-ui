import { defineConfig } from 'vite';

export default defineConfig({
  // open the kitchen-sink directly on `bun run dev`
  server: {
    open: '/demo/',
  },
});
