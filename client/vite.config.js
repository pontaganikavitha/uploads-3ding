export default defineConfig({
    base: '/',
    server: {
      port: 3002,
      host: '0.0.0.0',
      strictPort: true,
      cors: {
        origin: ['https://test1.3ding.in'],
        credentials: true,
      },
    },
  })
  