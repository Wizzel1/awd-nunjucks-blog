import { Request, Response } from "express";
import blogData from "../../data/blogentries.json";
import slugify from "slugify";

export default function indexController(req: Request, res: Response) {
    const newBlogData = blogData.map((p) => ({
        ...p,
        slug: slugify(p.title, {
          lower: true,
          strict: true,
          remove: /[*+~.()'"!:@]/g,
        }),
        date: new Date(p.createdAt * 1000).toLocaleDateString("de-DE"),
      }));
  res.render("index.html", { newBlogData });
}