// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import path from 'node:path'
// import autoprefixer from 'autoprefixer'

// export default defineConfig(() => {
//   return {
//     base: './',
//     build: {
//       outDir: 'build',
//     },
//     css: {
//       postcss: {
//         plugins: [
//           autoprefixer({}), // add options if needed
//         ],
//       },
//       preprocessorOptions: {
//         scss: {
//           quietDeps: true,
//           silenceDeprecations: ['import', 'legacy-js-api'],
//         },
//       },
//     },
//     esbuild: {
//       loader: 'jsx',
//       include: /src\/.*\.jsx?$/,
//       exclude: [],
//     },
//     optimizeDeps: {
//       force: true,
//       esbuildOptions: {
//         loader: {
//           '.js': 'jsx',
//         },
//       },
//     },
//     plugins: [react()],
//     resolve: {
//       alias: [
//         {
//           find: 'src/',
//           replacement: `${path.resolve(__dirname, 'src')}/`,
//         },
//       ],
//       extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.scss'],
//     },
//     server: {
//       port: 3000,
//       proxy: {
//         // https://vitejs.dev/config/server-options.html
//       },
//     },
//   }
// })

// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import path from 'node:path'
// import autoprefixer from 'autoprefixer'

// export default defineConfig(() => {
//   return {
//     base: './',
//     build: {
//       outDir: 'build',
//     },
//     css: {
//       postcss: {
//         plugins: [
//           autoprefixer({}), // add options if needed
//         ],
//       },
//       preprocessorOptions: {
//         scss: {
//           quietDeps: true,
//           silenceDeprecations: ['import', 'legacy-js-api'],
//         },
//       },
//     },
//     esbuild: {
//       loader: 'jsx',
//       include: /src\/.*\.jsx?$/,
//       exclude: [],
//     },
//     optimizeDeps: {
//       force: true,
//       esbuildOptions: {
//         loader: {
//           '.js': 'jsx',
//         },
//       },
//     },
//     plugins: [react()],
//     resolve: {
//       alias: [
//         {
//           find: 'src/',
//           replacement: `${path.resolve(__dirname, 'src')}/`,
//         },
//       ],
//       extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.scss'],
//     },
//     // server: {
//     //   port: 3000,
//     //   proxy: {
//     //     // https://vitejs.dev/config/server-options.html
//     //   },
//     // },
//     server: {
//       port: 3000,
//       host: '0.0.0.0', // Allows access from external sources
//       strictPort: true, // Ensures the server runs on the specified port
//       cors: {
//         origin: ['http://3.26.98.75'], // Allow requests from this domain
//         credentials: true,
//       },
//       proxy: {},
//       allowedHosts: ["3.26.98.75"],
//     },
//   }
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import autoprefixer from 'autoprefixer'

export default defineConfig(() => {
  return {
    base: '/admin/',  // Important for correct path resolution
    build: {
      outDir: 'build',
    },
    css: {
      postcss: {
        plugins: [autoprefixer({})],
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
    server: {
      port: 3000,
      host: '0.0.0.0', // Allows external access
      strictPort: true, // Ensures it runs on port 3000
      cors: {
        origin: ['https://test1.3ding.in'], // Use HTTPS
        credentials: true,
      },
      proxy: {},
      allowedHosts: ['test1.3ding.in'],
    },
  };
});
