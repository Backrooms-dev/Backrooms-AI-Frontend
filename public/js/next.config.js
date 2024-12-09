/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    esmExternals: 'loose',
  },
  webpack: (config) => {
    config.externals = [...config.externals, { canvas: "canvas" }]; // required to make pdfjs work
    return config;
  },
  async rewrites() {
    return [
      {
        source: "/api/chat", // Requête venant du frontend
        destination: "http://localhost:8000/api/chat", // Redirection vers le backend FastAPI
      },
    ];
  },
};

module.exports = nextConfig;