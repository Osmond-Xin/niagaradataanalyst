/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/head2026',
        destination: '/head2026/index.html',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
