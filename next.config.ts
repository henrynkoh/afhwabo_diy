import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use webpack explicitly to handle Playwright properly
  webpack: (config, { isServer, webpack }) => {
    // Exclude Playwright and Node.js modules from client-side bundle
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
        dns: false,
        path: false,
        os: false,
        crypto: false,
        stream: false,
        util: false,
        url: false,
        http: false,
        https: false,
        zlib: false,
        buffer: false,
      };
      
      // Ignore Playwright completely in client bundle
      config.externals = config.externals || [];
      config.externals.push({
        'playwright': 'commonjs playwright',
        'playwright-core': 'commonjs playwright-core',
        '@playwright/test': 'commonjs @playwright/test',
      });
      
      // Ignore Playwright files using webpack.IgnorePlugin - more aggressive
      config.plugins = config.plugins || [];
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^playwright$/,
        }),
        new webpack.IgnorePlugin({
          resourceRegExp: /^playwright-core$/,
        }),
        new webpack.IgnorePlugin({
          resourceRegExp: /^@playwright\/test$/,
        }),
        // Ignore any file that imports playwright
        new webpack.IgnorePlugin({
          checkResource: (resource: string, context: string) => {
            if (context.includes('node_modules/playwright') || 
                context.includes('node_modules/playwright-core')) {
              return true;
            }
            return false;
          },
        })
      );
    }
    
    return config;
  },
  // Server-only modules - these will never be bundled for client
  serverExternalPackages: ['playwright', 'playwright-core', '@playwright/test'],
  // Output configuration
  output: 'standalone',
  // Turbopack config (empty to silence warning, webpack handles Playwright)
  turbopack: {},
};

export default nextConfig;
