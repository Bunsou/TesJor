export const config = {
  // Database
  databaseUrl: process.env.DATABASE_URL || "",

  // Better Auth
  betterAuthSecret: process.env.BETTER_AUTH_SECRET || "",
  betterAuthUrl: process.env.BETTER_AUTH_URL || "http://localhost:3000",

  // Google OAuth
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "",

  // UploadThing
  uploadthingSecret: process.env.UPLOADTHING_SECRET || "",
  uploadthingAppId: process.env.UPLOADTHING_APP_ID || "",

  // Upstash Redis
  upstashRedisRestUrl: process.env.UPSTASH_REDIS_REST_URL || "",
  upstashRedisRestToken: process.env.UPSTASH_REDIS_REST_TOKEN || "",

  // Google Maps (Public)
  googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",

  // Environment
  nodeEnv: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3000,
};
