import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  root: "src/pages",
  base: '/y-prosemirror-node-selection-bug/',
  build: {
    outDir: '../../dist',
    rollupOptions: {
      input: {
        main: new URL('./src/pages/index.html', import.meta.url).pathname,
        yjs: new URL('./src/pages/yjs/index.html', import.meta.url).pathname
      }
    }
  }
})
