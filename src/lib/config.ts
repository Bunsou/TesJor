export const config = {
  // Database
  databaseUrl: process.env.DATABASE_URL || "",

  // Better Auth
  betterAuthSecret: process.env.BETTER_AUTH_SECRET || "",
  betterAuthUrl: process.env.BETTER_AUTH_URL || "http://localhost:3000",

  // Google OAuth
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "",

  // Cloudinary
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || "",
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || "",

  // Upstash Redis
  upstashRedisRestUrl: process.env.UPSTASH_REDIS_REST_URL || "",
  upstashRedisRestToken: process.env.UPSTASH_REDIS_REST_TOKEN || "",

  // Google Maps (Public)
  googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",

  // Environment
  nodeEnv: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3000,
};
