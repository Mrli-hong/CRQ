import { resolve, join } from 'path'
import { defineConfig } from 'vite'
import { buildPlugin } from 'vite-plugin-build'
import requireTransform from 'vite-plugin-require-transform'
import vue from '@vitejs/plugin-vue2'
import packageJson from './package.json'
const name = packageJson.name
export default defineConfig({
  resolve: {
    alias: {
      '@': join(__dirname, 'src'),
    },
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
    proxy: {
      '/g': {
        target: 'http://10.20.36.200:8088', // 后台 API 地址
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('proxyReq', function (proxyReq, req, res, options) {
            // 手动塞cookie，本地开发自己验证接口，需要更新token
            const cookieValue =
              'token=f006305d-a4cd-4bb3-b4dc-d4e1740c62bf; user_token=70F8B104A3C2FDF6E94B7A1F47B9CA5247D08B27444753171C5114178468818774F55C17E18538D4' // 固定的 Cookie 值
            proxyReq.setHeader('Cookie', cookieValue)
            proxyReq.removeHeader('origin')
          })
        },
      },
    },
  },
  plugins: [
    vue(),
    buildPlugin({
      fileBuild: false,
      libBuild: {
        buildOptions: [
          {
            rollupOptions: {
              // 确保外部化处理那些你不想打包进库的依赖
              external: ['vue', 'h_ui'],
              output: {
                // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
                globals: {
                  vue: 'Vue',
                  h_ui: 'h_ui',
                },
                assetFileNames: (assetInfo) => {
                  if (assetInfo.name === 'style.css') return 'index.css'
                  return assetInfo.name
                },
              },
            },
            lib: {
              entry: resolve(__dirname, 'src/main.ts'),
              name: name,
              formats: ['umd', 'cjs'],
              fileName: 'index',
            },
            outDir: 'lib',
            copyPublicDir: false,
            target: 'es2016',
          },
        ],
      },
    }),
    requireTransform({
      fileRegex: /.js$|.vue$/,
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    alias: [{ find: /^vue$/, replacement: 'vue/dist/vue.runtime.common.js' }],
  },
  define: {
    'process.env.NODE_ENV': '"production"',
  },
})
