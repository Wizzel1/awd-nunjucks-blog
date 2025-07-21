import { getDB } from "../db/database";
import { BlogEntry } from "../types/blogEntry";
import { Redirect, redirectSchema } from "../types/redirect";

export class RedirectsService {
  public async getRedirect(old_slug: string): Promise<Redirect | null> {
    const db = getDB();
    if (!db) throw new Error("Database not connected");
    return new Promise<Redirect | null>((res, rej) => {
      db.get(
        "SELECT * FROM redirects WHERE old_slug = ?",
        [old_slug],
        (err, row) => {
          if (err) {
            console.error(err);
            rej(err);
          }
          res(row ? redirectSchema.parse(row) : null);
        }
      );
    });
  }

  public async createRedirect(
    entry: BlogEntry,
    new_slug?: string
  ): Promise<void> {
    const db = getDB();
    if (!db) throw new Error("Database not connected");
    if (entry.slug === new_slug) return;
  }
}
