/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
    domains: ['res.cloudinary.com'], // ✅ allow Cloudinary-hosted images
    }
};

export default nextConfig;
