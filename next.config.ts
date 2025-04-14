/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    typescript: {
        // During development only
        ignoreBuildErrors: true,
    }
}

module.exports = nextConfig