/** @type {import('next').NextConfig} */
const { version } = require('./package.json');

const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  reloadOnOnline: false,
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkOnly',
    },
  ],
  reloadOnOnline: false,
  pathPrefix: '/pengvin-share',
});

module.exports = withPWA({
  output: "standalone", env: {
    VERSION: version,
  },
  serverRuntimeConfig: {
    apiURL: process.env.API_URL ?? 'http://localhost:8080',
  },
});
