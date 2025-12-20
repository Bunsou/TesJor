import { z } from "zod";
import { categoryEnum, createListingSchema } from "@/features/listings/schemas";

// Re-export the unified create listing schema
export { createListingSchema };

// Admin Create Request Schema (for determining category before full validation)
export const adminCreateSchema = z.object({
  category: categoryEnum,
});

// Types
export type CreateListing = z.infer<typeof createListingSchema>;
export type AdminCreate = z.infer<typeof adminCreateSchema>;
