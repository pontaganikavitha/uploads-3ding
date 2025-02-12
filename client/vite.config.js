// export default defineConfig({
//     base: '/',
//     server: {
//       port: 3002,
//       host: '0.0.0.0',
//       strictPort: true,
//       cors: {
//         origin: ['http://test1.3ding.in'],
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
      origin: ['https://test1.3ding.in'], // Use HTTPS in production
      credentials: true,
    },
  },
});
