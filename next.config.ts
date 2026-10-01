import type { NextConfig } from 'next';

// GitHub Pages serves this repository under /kyson-library/.
// Keep the original root-path configuration for the existing hosted site.
const nextConfig: NextConfig = process.env.GITHUB_PAGES === 'true'
  ? { output: 'export' }
  : {};

export default nextConfig;
