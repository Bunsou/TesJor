import { z } from "zod";

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url().min(1, "DATABASE_URL is required"),

  // Better Auth
  BETTER_AUTH_SECRET: z
    .string()
    .min(32, "BETTER_AUTH_SECRET must be at least 32 characters"),
  BETTER_AUTH_URL: z.string().url().optional().default("http://localhost:3000"),

  // Google OAuth
  GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID is required"),
  GOOGLE_CLIENT_SECRET: z.string().min(1, "GOOGLE_CLIENT_SECRET is required"),

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: z.string().min(1, "CLOUDINARY_CLOUD_NAME is required"),
  CLOUDINARY_API_KEY: z.string().min(1, "CLOUDINARY_API_KEY is required"),
  CLOUDINARY_API_SECRET: z.string().min(1, "CLOUDINARY_API_SECRET is required"),

  // Upstash Redis
  UPSTASH_REDIS_REST_URL: z
    .string()
    .url()
    .min(1, "UPSTASH_REDIS_REST_URL is required"),
  UPSTASH_REDIS_REST_TOKEN: z
    .string()
    .min(1, "UPSTASH_REDIS_REST_TOKEN is required"),

  // Google Maps (Public)
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: z
    .string()
    .min(1, "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is required"),

  // Environment
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

// Validate environment variables at build time (server-side only)
// Client-side only has access to NEXT_PUBLIC_* vars, so we skip full validation
const isServer = typeof window === "undefined";

type EnvParseResult = ReturnType<typeof envSchema.safeParse>;

let parsedEnv: EnvParseResult;

if (isServer) {
  parsedEnv = envSchema.safeParse(process.env);

  if (!parsedEnv.success) {
    const errors = parsedEnv.error.flatten().fieldErrors;
    console.error("❌ Invalid environment variables:", errors);

    // During build, provide more helpful error message
    const missingVars = Object.keys(errors);
    console.error("\n📋 Missing environment variables in Vercel:");
    console.error(
      "Please add these in your Vercel project settings (Settings > Environment Variables):\n"
    );
    missingVars.forEach((varName) => {
      console.error(`  ${varName}`);
    });
    console.error("\nSee .env.example for reference values.\n");

    throw new Error("Invalid environment variables");
  }
} else {
  // Client-side: only validate public vars, provide defaults for server vars
  parsedEnv = {
    success: true,
    data: {
      DATABASE_URL: "",
      BETTER_AUTH_SECRET: "",
      BETTER_AUTH_URL:
        process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
      GOOGLE_CLIENT_ID: "",
      GOOGLE_CLIENT_SECRET: "",
      CLOUDINARY_CLOUD_NAME: "",
      CLOUDINARY_API_KEY: "",
      CLOUDINARY_API_SECRET: "",
      UPSTASH_REDIS_REST_URL: "",
      UPSTASH_REDIS_REST_TOKEN: "",
      NEXT_PUBLIC_GOOGLE_MAPS_API_KEY:
        process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
      NODE_ENV:
        (process.env.NODE_ENV as "development" | "production" | "test") ||
        "development",
    },
  } as EnvParseResult;
}
export const env = parsedEnv.data;
