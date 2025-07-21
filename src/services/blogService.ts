import sqlite3 from "sqlite3";
import { BlogEntry, blogEntrySchema } from "../types/blogEntry";
import { getDB } from "../db/database";

export class BlogService {
  private _db: sqlite3.Database = getDB();

  public async getBlogEntries(): Promise<BlogEntry[]> {
    const db = this._db;
    if (!db) throw new Error("Database not connected");
    return new Promise<BlogEntry[]>((res, rej) => {
      db.all("SELECT * FROM blog_entries", [], (err, rows) => {
        if (err) {
          console.error(err);
          rej(err);
        }
        const parsed = blogEntrySchema.array().safeParse(rows);
        if (parsed.error) {
          console.error(parsed.error);
          rej(parsed.error);
        }
        console.log(parsed.data);
        res(parsed.data ?? []);
      });
    });
  }
  
  public async getBlogEntryById(id: number): Promise<BlogEntry | null> {
    const db = this._db;
    if (!db) throw new Error("Database not connected");
    return new Promise<BlogEntry | null>((res, rej) => {
      db.get("SELECT * FROM blog_entries WHERE id = ? LIMIT 1", [id], (err, row) => {
        if (err) {
          console.error(err);
          rej(err);
        }
        const parsed = blogEntrySchema.safeParse(row);
        if (parsed.error) {
          console.error(parsed.error);
          rej(parsed.error);
        }
        res(parsed.data ?? null);
      });
    });
  }

 
  public async saveBlogEntry(blogEntry: BlogEntry) {
    const db = this._db;
    if (!db) {
      throw new Error("Database not connected");
    }
    return new Promise<boolean>((res, rej) => {
      db.run(
        "INSERT INTO blog_entries (title, teaser, author, content, createdAt, image) VALUES (?, ?, ?, ?, ?, ?)",
        [
          blogEntry.title,
          blogEntry.teaser,
          blogEntry.author,
          blogEntry.content,
          blogEntry.createdAt,
          blogEntry.image,
        ],
        (err) => {
          if (err) {
            console.error("Error saving blog entry", err);
            rej(false);
          }
          res(true);
        }
      );
    });
  }


}
