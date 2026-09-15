import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  async redirects() {
    return [
      { source: "/app", destination: "/focus", permanent: false },
      { source: "/app/stats", destination: "/stats", permanent: false },
      { source: "/app/unlock", destination: "/unlocks", permanent: false },
      { source: "/app/setup", destination: "/setup", permanent: false },
      { source: "/app/lock", destination: "/lock", permanent: false },
      { source: "/app/focus", destination: "/session", permanent: false },
      { source: "/motivation", destination: "/profile", permanent: false },
    ];
  },
};

export default nextConfig;
