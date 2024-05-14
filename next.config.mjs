/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
        runtime: 'experimental-edge', // Ensure the runtime is set to edge for SSR and dynamic handling
    },
};

export default nextConfig;
