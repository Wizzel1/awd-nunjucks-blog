import { NextFunction, Request, Response } from "express";
import { BlogEntry, blogEntrySchema } from "../types/blogEntry";
import { debounce } from "radashi";
import fs from "fs-extra";

export const modelMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const blogEntryModel = BlogEntryModel.getInstance();
  res.locals.blogEntryModel = blogEntryModel;
  next();
};

export class BlogEntryModel {
  private static instance: BlogEntryModel;

  private _blogEntryMap: Map<string, BlogEntry>;

  private constructor() {
    this._blogEntryMap = new Map();
  }

  public static getInstance(): BlogEntryModel {
    if (!BlogEntryModel.instance) {
      BlogEntryModel.instance = new BlogEntryModel();
    }
    return BlogEntryModel.instance;
  }

  public async init(): Promise<void> {
    const blogEntries = await fs.readJson("data/blogentries.json");
    const parsed = blogEntrySchema.array().parse(blogEntries);
    for (const blogEntry of parsed) {
      this._blogEntryMap.set(blogEntry.slug, blogEntry);
    }
  }

  public async save(): Promise<void> {
    await fs.writeJson("data/blogentries.json", this.blogEntries);
  }

  public findBlogEntryBySlug(slug: string): BlogEntry | undefined {
    return this._blogEntryMap.get(slug);
  }

  public async updateBlogEntryBySlug(
    slug: string,
    updatedEntry: Omit<BlogEntry, "slug">
  ): Promise<boolean> {
    const oldEntry = this._blogEntryMap.get(slug);
    if (!oldEntry) {
      return false;
    }

    const validatedEntry = blogEntrySchema.parse(updatedEntry);
    this._blogEntryMap.delete(oldEntry.slug);
    this._blogEntryMap.set(validatedEntry.slug, validatedEntry);
    await this.save();

    return true;
  }

  get blogEntries(): BlogEntry[] {
    return Array.from(this._blogEntryMap.values());
  }
}
