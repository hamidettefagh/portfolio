import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/notes/agent-production-readiness",
        destination: "/agent-production-readiness",
        permanent: true,
      },
      { source: "/notes", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
