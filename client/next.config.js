// @type {import('next').NextConfig}
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: [
            "res.cloudinary.com",
            "static.cdnno.com",
            "1.bp.blogspot.com",
            "2.bp.blogspot.com",
            "3.bp.blogspot.com",
            "4.bp.blogspot.com"
        ],
        minimumCacheTTL: 24 * 60 * 60,
    },
    experimental: {
        styledComponents: true
    }
};

module.exports = nextConfig;
