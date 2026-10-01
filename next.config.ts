import type { NextConfig } from "next";

const staticExport = process.env.STATIC_EXPORT === "1";
const config: NextConfig = {
  agentRules: false,
  output: staticExport ? "export" : "standalone",
  trailingSlash: staticExport,
};
export default config;
