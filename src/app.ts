require("dotenv").config();

import express from "express";
import type { Request, Response } from "express";
import nunjucks from "nunjucks";
import cors from "cors";
import slugify from "slugify";
import blogData from "../data/blogentries.json";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.static("public"));

nunjucks.configure("templates", {
  autoescape: true,
  express: app,
});

const newBlogData = blogData.map((p) => ({
  ...p,
  slug: slugify(p.title, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
  }),
  date: new Date(p.createdAt * 1000).toLocaleDateString("de-DE"),
}));

app.get("/", (req: Request, res: Response) => {
  res.render("index.html", { newBlogData });
});

app.get("/index.html", (req: Request, res: Response) => {
  res.render("index.html", { newBlogData });
});

app.get("/about.html", (req: Request, res: Response) => {
  res.render("about.html");
});

app.get("/contact.html", (req: Request, res: Response) => {
  res.render("contact.html");
});

app.get("/post/:slug", (req: Request, res: Response) => {
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
});

app.get("/post.html", (req: Request, res: Response) => {
  const post = newBlogData[0];

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
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
