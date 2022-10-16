/** @type {import('next').NextConfig} */

const nextConfig = {
  publicRuntimeConfig: {
    ALLOW_REGISTRATION: process.env.ALLOW_REGISTRATION,
    SHOW_HOME_PAGE: process.env.SHOW_HOME_PAGE,
    MAX_FILE_SIZE: process.env.MAX_FILE_SIZE,
  }
}

const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV == "development"
});


module.exports = withPWA(nextConfig);
