/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      // Review screenshots are up to 5 MB; leave headroom for the form
      // boundary + optional email. Default is 1 MB.
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
