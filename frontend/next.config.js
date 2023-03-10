/** @type {import('next').NextConfig} */

const { version } = require('./package.json');

const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkOnly',
    },
  ],
  reloadOnOnline: false,
});

module.exports = withPWA({
  output: "standalone", env: {
    VERSION: version,
  },
});
