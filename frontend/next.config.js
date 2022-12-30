/** @type {import('next').NextConfig} */

const { version } = require('./package.json');

const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV == "development",
});

module.exports = withPWA({
  output: "standalone", env: {
    VERSION: version,
  },
});
