export default defineConfig({
    base: '/',
    server: {
      port: 3002,
      host: '0.0.0.0',
      strictPort: true,
      cors: {
        origin: ['http://13.236.153.128'],
        credentials: true,
      },
    },
  })
  