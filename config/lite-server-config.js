module.exports = {
  port: 1337,
  open: false,
  server: {
    baseDir: 'build/',
    middleware: {
      0: null,     // removes default `connect-logger` middleware
    },
  },
};