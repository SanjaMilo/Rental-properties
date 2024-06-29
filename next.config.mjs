/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                pathname: '**',
            },
        ]
    }
};

export default nextConfig;


// When we added the ProfileImage on the logged in user, we get this error: 
//? Error: Invalid src prop (https://lh3.googleusercontent.com/a/ACg8ocKFUh_-AG7qPOndHPBr3kWhELRaCttbufM94hSbhjOK8ZYvww=s96-c) on `next/image`, hostname "lh3.googleusercontent.com" is not configured under images in your `next.config.js`
//* See more info: https://nextjs.org/docs/messages/next-image-unconfigured-host

//TODO: So we need tho set the config inside the empty object -> const nextConfig = {}; above 
