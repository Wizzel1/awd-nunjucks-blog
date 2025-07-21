import { Request, Response } from "express";
import { BlogEntryModel } from "../../models/blogEntryModel";
import { blogEntrySchema } from "../../types/blogEntry";

export async function showEditForm(req: Request, res: Response) {
  const blogEntryModel = res.locals.blogEntryModel;
  const slug = req.params.slug;

  if (!slug) {
    return res.status(400).send("Invalid post slug");
  }

  const post = blogEntryModel.findBlogEntryBySlug(slug);
  if (!post) {
    return res.status(404).send("Post not found");
  }

  res.render("admin/editPost.html", { post, slug });
}

export async function updatePost(req: Request, res: Response) {
  const model = BlogEntryModel.getInstance();
  const slug = req.params.slug;

  if (!slug) {
    return res.status(400).send("Invalid post slug");
  }

  try {
    const { title, image, author, teaser, content } = req.body;


    if (!title || !image || !author || !teaser || !content) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingPost = await model.findBlogEntryBySlug(slug);
    if (!existingPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    const updatedEntry = blogEntrySchema.parse({
      title,
      image,
      author,
      createdAt: existingPost.createdAt,
      teaser,
      content,
    });

    const success = await model.updateBlogEntryBySlug(slug, updatedEntry);

    if (!success) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json({ success: true, message: "Post updated successfully" });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ error: "Failed to update post" });
  }
}
