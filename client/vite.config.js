export default defineConfig({
    base: '/',
    server: {
      port: 3002,
      host: '0.0.0.0',
      strictPort: true,
      cors: {
        origin: ['http://3.27.189.89'],
        credentials: true,
      },
    },
  })
  