// export default defineConfig({
//     base: '/',
//     server: {
//       port: 3002,
//       host: '0.0.0.0',
//       strictPort: true,
//       cors: {
//         origin: ['http://3.26.98.75'],
//         credentials: true,
//       },
//     },
//   })
  

import { defineConfig } from 'vite';

export default defineConfig({
  base: '/', // Ensures correct path resolution for assets
  server: {
    port: 3002,
    host: '0.0.0.0',
    strictPort: true,
    cors: {
      origin: ['http://3.26.98.75'], // Use HTTPS in production
      credentials: true,
    },
  },
});
