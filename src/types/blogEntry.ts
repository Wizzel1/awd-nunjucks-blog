import slugify from "slugify";
import { z } from "zod";
export const blogEntrySchema = z
  .object({
    title: z.string().min(1),
    image: z.string().min(1),
    author: z.string().min(1),
    createdAt: z.number(),
    teaser: z.string().min(1),
    content: z.string().min(1),
  })
  .transform((data) => ({
    ...data,
    slug: slugify(data.title, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g,
    }),
  }));
export type BlogEntry = z.infer<typeof blogEntrySchema>;
