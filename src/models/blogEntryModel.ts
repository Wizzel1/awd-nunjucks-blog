import { BlogEntry, blogEntrySchema } from "../types/blogEntry";
import fs from "fs-extra";
import { BlogService } from "../services/blogService";
import { RedirectsService } from "../services/redirectsService";

export class BlogEntryModel {
  private static instance: BlogEntryModel;
  private blogService: BlogService | null = null;
  private redirectsService: RedirectsService | null = null;
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

  public init(
    blogService: BlogService,
    redirectsService: RedirectsService
  ): void {
    this.blogService = blogService;
    this.redirectsService = redirectsService;
  }

  public async findBlogEntryBySlug(slug: string): Promise<BlogEntry | null> {
    if (!this.blogService) return null;
    if (!this.redirectsService) return null;
    const redirect = await this.redirectsService.getRedirect(slug);
    if (!redirect) return null
    return this.blogService.getBlogEntryById(redirect.id);
  }

  public async updateBlogEntryBySlug(
    slug: string,
    updatedEntry: Omit<BlogEntry, "slug">
  ): Promise<boolean> {
    return true;
    // const oldEntry = this._blogEntryMap.get(slug);
    // if (!oldEntry) {
    //   return false;
    // }

    // const validatedEntry = blogEntrySchema.parse(updatedEntry);
    // this._blogEntryMap.delete(oldEntry.slug);
    // this._blogEntryMap.set(validatedEntry.slug, validatedEntry);
    // await this.save();

    // return true;
  }

  async getBlogEntries(): Promise<BlogEntry[]> {
    if (!this.blogService) {
      console.error("BlogService not initialized");
      return [];
    }

    return this.blogService.getBlogEntries();
  }

  public async migrateJsonData() {
    if (!this.blogService) throw new Error("BlogService not initialized");
    if (!this.redirectsService)
      throw new Error("RedirectsService not initialized");

    try {
      const fileExists = await fs.pathExists("data/blogentries.json");
      if (!fileExists) return;

      const blogEntries = await fs.readJson("data/blogentries.json");
      const parsed = blogEntrySchema.array().parse(blogEntries);
      for await (const blogEntry of parsed.reverse()) {
        const saved = await this.blogService.saveBlogEntry(blogEntry);
        if (saved) await this.redirectsService.createRedirect(blogEntry);
        if (!saved) console.error("Error saving blog entry", blogEntry);
      }
      // await fs.remove("data/blogentries.json");
    } catch (err) {
      console.error("Error migrating json data", err);
    }
  }
}
