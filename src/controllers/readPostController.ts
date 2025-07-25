import { Request, Response } from "express";
import { BlogEntryModel } from "../models/blogEntryModel";

export default async function readPostController(req: Request, res: Response) {
  const slug = req.params.slug;
  const model = BlogEntryModel.getInstance();
  const post = await model.findBlogEntryBySlug(slug);
  if (!post) {
    return res.status(404).send("Post not found");
  }

  res.render("pages/post.html", {
    title: post.title,
    image: post.image,
    author: post.author,
    date: post.createdAt,
    teaser: post.teaser,
    content: post.content,
  });
}
