import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: '/pcasems/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        simulator: resolve(__dirname, 'simulator.html'),
      },
    },
  },
})