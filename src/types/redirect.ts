import { z } from "zod";


export const redirectSchema = z.object({
  id: z.number(),
  slug: z.string(),
  blog_entry_id: z.number().optional(),
});

export type Redirect = z.infer<typeof redirectSchema>;