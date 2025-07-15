import { Request, Response } from "express";

export default function readPostController(req: Request, res: Response) {
    (req: Request, res: Response) => {

        const slug = req.params.slug;
        const post = newBlogData.find((p) => p.slug === slug);
        
        if (!post) {
          return res.status(404).send("Post not found");
        }

        res.render("post.html", {
          title: post.title,
          image: post.image,
          author: post.author,
          date: post.date,
          teaser: post.teaser,
          content: post.content,
        });
      }
}