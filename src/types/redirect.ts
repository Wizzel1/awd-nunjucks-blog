import { z } from "zod";


export const redirectSchema = z.object({
  id: z.number(),
  old_slug: z.string(),
  new_slug: z.string(),
});

export type Redirect = z.infer<typeof redirectSchema>;