

// @type {import('next').NextConfig}
const nextConfig = ({
    reactStrictMode: true,
    images: {
        domains: ["res.cloudinary.com", "static.cdnno.com"],
    },
});

module.exports = nextConfig;
