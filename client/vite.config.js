// export default defineConfig({
//     base: '/',
//     server: {
//       port: 3002,
//       host: '0.0.0.0',
//       strictPort: true,
//       cors: {
//         origin: ['http://3.27.161.100'],
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
      origin: ['https://3.27.161.100'], // Use HTTPS in production
      credentials: true,
    },
  },
});
