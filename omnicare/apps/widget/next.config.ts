import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@omnicare/care-ui", "@omnicare/care-engine", "@omnicare/shared"],
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
