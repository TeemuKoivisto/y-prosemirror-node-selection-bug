import { resolve } from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  root: "src/pages",
  build: {
    rollupOptions: {
      input: {
        main: new URL('./src/pages/index.html', import.meta.url).pathname,
        yjs: new URL('./src/pages/yjs/index.html', import.meta.url).pathname
        // main: resolve(__dirname, 'index.html'),
        // yjs: resolve(__dirname, 'src/yjs/index.html')
      }
    }
  }
})
