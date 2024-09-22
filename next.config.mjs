/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript : {
    ignoreBuildErrors : true
  },
  experimental: {
    staleTimes: {
      dynamic: 30,
    },
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
      },
    ],
  },

};

export default nextConfig;
