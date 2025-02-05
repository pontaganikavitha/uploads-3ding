import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import autoprefixer from 'autoprefixer'

export default defineConfig(() => {
  return {
    base: './',
    build: {
      outDir: 'build',
    },
    css: {
      postcss: {
        plugins: [
          autoprefixer({}), // add options if needed
        ],
      },
      preprocessorOptions: {
        scss: {
          quietDeps: true,
          silenceDeprecations: ['import', 'legacy-js-api'],
        },
      },
    },
    esbuild: {
      loader: 'jsx',
      include: /src\/.*\.jsx?$/,
      exclude: [],
    },
    optimizeDeps: {
      force: true,
      esbuildOptions: {
        loader: {
          '.js': 'jsx',
        },
      },
    },
    plugins: [react()],
    resolve: {
      alias: [
        {
          find: 'src/',
          replacement: `${path.resolve(__dirname, 'src')}/`,
        },
      ],
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.scss'],
    },
    // server: {
    //   port: 3000,
    //   proxy: {
    //     // https://vitejs.dev/config/server-options.html
    //   },
    // },
    server: {
      port: 3000,
      host: '0.0.0.0', // Allows access from external sources
      strictPort: true, // Ensures the server runs on the specified port
      cors: {
        origin: ['http://test1.3ding.in:3002', 'http://test1.3ding.in:3000'], // Allow requests from this domain
        credentials: true,
      },
      proxy: {
      },
    },
    preview: {
      port: 4173, // Default preview mode port
      host: '0.0.0.0',
    },
  }
})
