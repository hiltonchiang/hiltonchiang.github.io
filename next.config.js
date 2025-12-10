import { withContentlayer } from 'next-contentlayer2'
import bundleAnalyzer from '@next/bundle-analyzer'
import mdxMermaid from 'mdx-mermaid';
import { Mermaid } from 'mdx-mermaid/lib/Mermaid'; // For direct component usage

// You might need to insert additional domains in script-src if you are using external services
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' giscus.app analytics.umami.is;
  style-src 'self' 'unsafe-inline';
  img-src * blob: data:;
  media-src 'self' *.s3.amazonaws.com;
  connect-src *;
  font-src 'self';
  frame-src https://www.youtube.com giscus.app;
`

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\n/g, ''),
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
]

const output = process.env.EXPORT ? 'export' : undefined
const basePath = process.env.BASE_PATH || undefined
const unoptimized = process.env.UNOPTIMIZED ? true : undefined

// Configure bundle analyzer factory correctly
const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === 'true' })

/**
 * @type {import('next/dist/next-server/server/config').NextConfig}
 **/
const baseConfig = {
  turbopack: {
    // ...
  },
  output,
  basePath,
  reactStrictMode: true,
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  eslint: {
    dirs: ['app', 'components', 'layouts', 'scripts'],
 },
    images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
    unoptimized,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
  webpack: (config, options) => {
    // Ensure resolve object exists
    config.resolve = config.resolve || {}

    // 1) Fallbacks: tell Webpack NOT to attempt polyfills for Node builtins used only on server
    // This prevents errors like "Could not resolve 'tty'".
    config.resolve.fallback = {
      ...(config.resolve.fallback || {}),
      tty: false,
      fs: false,
      net: false,
      tls: false,
      child_process: false,
      readline: false,
      // add more as needed
    }

    // 2) Aliases: prefer browser-friendly entry points for modules that ship node/browser variants
    // Common fix: alias debug to its browser build so it won't require `tty`.
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      debug: 'debug/src/browser.js',
    }

    // SVG loader
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    // MDX loader with mdx-mermaid
    config.module.rules.push({
      test: /\.mdx?$/,
      use: [
        {
          loader: '@mdx-js/loader',
          options: {
            remarkPlugins: [
              [mdxMermaid.default, { output: 'svg' }], // Use mdx-mermaid plugin
            ],
            // ... other MDX options
          },
        },
      ],
    })

    return config
  },
}

// Compose plugins and export the final resolved config object
const plugins = [withContentlayer, withBundleAnalyzer]
const nextConfig = plugins.reduce((acc, plugin) => plugin(acc), baseConfig)

export default nextConfig
