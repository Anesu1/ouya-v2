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
  // These packages are server-only — don't bundle them with webpack,
  // load them from node_modules at runtime instead.
  serverExternalPackages: [
    '@prisma/client',
    'prisma',
    'bcryptjs',
    'nodemailer',
    'stripe',
    'resend',
    '@mailchimp/mailchimp_marketing',
  ],
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000']
    },
    cpus: 1,
    workerThreads: false,
    webpackMemoryOptimizations: true,
    // Only import what's actually used from these large packages
    optimizePackageImports: ['lucide-react', 'recharts', 'framer-motion', '@radix-ui/react-icons'],
  },
  staticPageGenerationTimeout: 1000,
  webpack: (config, { dev }) => {
    config.infrastructureLogging = { level: 'error' }
    
    if (!dev) {
      // Re-enabled optimizations now that the infinite loop is fixed.
      config.optimization.minimize = true
      config.optimization.concatenateModules = true
      config.cache = false
    }
    return config
  },
}

export default nextConfig
