/* eslint-disable @typescript-eslint/no-var-requires */
const { withSentryConfig } = require("@sentry/nextjs")
const withPlugins = require("next-compose-plugins")
const withPreact = require("next-plugin-preact")
const { withPlaiceholder } = require("@plaiceholder/next")
const nextPWA = require("next-pwa")
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true"
})

const withPWA = [
  nextPWA,
  {
    pwa: {
      dest: "public",
      // don't precache anything.
      buildExcludes: [/.*/],
      publicExcludes: ["!**/*"]
      // disable: process.env.NODE_ENV === 'development',
      // register: true,
      // scope: '/app',
      // sw: 'service-worker.js',
      // ...
    }
  }
]

const plugins = [withPreact, withBundleAnalyzer, withPlaiceholder, withPWA]
if (process.env.NODE_ENV === "production") plugins.push(withSentryConfig)

module.exports = withPlugins(plugins, {
  images: {
    domains: ["localhost", "grayson-media.sgp1.cdn.digitaloceanspaces.com"]
  }
})
