/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // We run tsc --noEmit separately; skip ESLint during `next build`
    // to avoid incompatibility between next/eslint and the installed ESLint version.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Already verified clean with tsc --noEmit; keep this false to catch regressions.
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },
};

export default nextConfig;
