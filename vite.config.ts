import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  const isProduction = process.env.NODE_ENV === 'production' || mode === 'production'
  const base = isProduction ? '/markdown-2-wechat-editor-pro/' : '/'
  
  return {
    base,
    plugins: [vue()],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'markdown': ['markdown-it'],
            'sanitizer': ['dompurify'],
            'vendor': ['vue'],
          },
        },
      },
    },
  }
})
