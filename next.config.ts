import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // 번들 분석 설정
  webpack: (config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) => {
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: isServer
            ? '../analyze/server.html'
            : './analyze/client.html',
          openAnalyzer: false,
        })
      );
    }
    return config;
  },
  
  // 실험적 기능
  experimental: {
    // 번들 크기 최적화
    optimizePackageImports: ['lucide-react', '@radix-ui/*', 'date-fns'],
  },
};

export default nextConfig;