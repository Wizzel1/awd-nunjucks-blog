import { Request, Response } from "express";

export default async function listBlogEntry(req: Request, res: Response) {
  const blogEntryModel = res.locals.blogEntryModel;
  const blogEntries = blogEntryModel.blogEntries;
  res.render("admin/listBlogEntry.html", { blogEntries });
}