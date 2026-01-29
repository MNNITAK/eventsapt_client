/** @type {import('next').NextConfig} */
const nextConfig = {
    env:{
        NinjaApiKey:"3Wlk1z/7EUfZob9p9l06Kg==014ARTIKUfZ9q2Jn",
        api_key:process.env.NEXT_API_KEY,
        auth_domain:process.env.NEXT_AUTH_DOMAIN,
        project_id:process.env.NEXT_PROJECT_ID,
        storage_bucket:process.env.NEXT_STORAGE_BUCKET,
        messaging_sender_id:process.env.NEXT_MESSAGING_SENDER_ID,
        app_id:process.env.NEXT_APP_ID,
        measurement_id:process.env.NEXT_MEASUREMENT_ID,
        backend_api:process.env.NEXT_PUBLIC_BACKEND_API,
        openapikey:process.env.API_KEY,
        frnt:process.env.NEXT_PUBLIC_FRNT
    },
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'images.pexels.com', // The correct hostname for Pexels images
            pathname: '/photos/**',       // Matches Pexels image paths
          },
          {
            protocol: 'https',
            hostname: 'images.pexels.com', // The correct hostname for Pexels images
            pathname: '/videos/**',       // Matches Pexels image paths
          },
          {
            protocol: 'https',
            hostname: 'cdn.pixabay.com', // The correct hostname for Pexels images
            pathname: '/**',  
               }  ,   // Matches Pexels image paths
          // },
          {
            protocol: 'https',
            hostname: 'image.wedmegood.com', // The correct hostname for Pexels images
            pathname: '/resized/**',       // Matches Pexels image paths
          },
          {
            protocol: "https",
            hostname: "**.cdninstagram.com",
          },
          {
            protocol: "https",
            hostname: "**.fna.fbcdn.net",
          }
        ],
      },
};

export default nextConfig;
