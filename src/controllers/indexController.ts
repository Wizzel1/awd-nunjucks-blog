import { Request, Response } from "express";

export default function indexController(req: Request, res: Response) {
  const blogEntryModel = res.locals.blogEntryModel;
  const blogEntries = blogEntryModel.blogEntries;
  res.render("pages/index.html", { newBlogData: blogEntries });
}
