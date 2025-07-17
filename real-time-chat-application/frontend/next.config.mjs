/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["picsum.photos" , "res.cloudinary.com"], // 👈 Add external domain here
    },
};

export default nextConfig;
