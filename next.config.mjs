/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ['cdn.sanity.io'],
  },
  experimental: {
    // Updated experimental features configuration
    serverActions: {
      allowedOrigins: ['localhost:3000']
    }
    // Removed serverExternalPackages as it's not recognized in Next.js 15.2.4
  },
  webpack: (config, { isServer }) => {
    // Fix for the webpack error
    config.infrastructureLogging = {
      level: 'error',
    }
    
    // Optimize bundle size
    config.optimization.moduleIds = 'deterministic'
    
    // Add transpilation for framer-motion
    config.module.rules.push({
      test: /node_modules\/framer-motion/,
      sideEffects: false
    });
    
    return config
  },
}

export default nextConfig
