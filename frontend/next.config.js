/** @type {import('next').NextConfig} */

const withPWA = require("next-pwa");

const nextConfig = withPWA({
  reactStrictMode: true,
  pwa: {
    dest: "public",
    disable: process.env.NODE_ENV == "development"
  },
  publicRuntimeConfig: {
    ALLOW_REGISTRATION: process.env.ALLOW_REGISTRATION,
    SHOW_HOME_PAGE: process.env.SHOW_HOME_PAGE,
    MAX_FILE_SIZE: process.env.MAX_FILE_SIZE,
    BACKEND_URL: process.env.BACKEND_URL
  }
})

module.exports = nextConfig
