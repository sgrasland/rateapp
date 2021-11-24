const withPWA = require("next-pwa");
const { i18n } = require('./next-i18next.config');

module.exports = withPWA({
  reactStrictMode: true,
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
  },
  i18n,
  webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = { 
      fs: false,
      tls: false,
      net: false,
      crypto: false,
      stream: false,
      zlib: false,
      timers: false 
    };
    return config;
  }
})