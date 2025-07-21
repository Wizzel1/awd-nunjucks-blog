import { Request, Response } from "express";
import { BlogEntryModel } from "../models/blogEntryModel";

export default async function indexController(req: Request, res: Response) {
  const model = BlogEntryModel.getInstance();
  const blogEntries = await model.getBlogEntries();
  res.render("pages/index.html", { newBlogData: blogEntries });
}
