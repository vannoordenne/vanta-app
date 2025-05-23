/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/vanta-ap' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/vanta-ap/' : '',
};

export default nextConfig; 