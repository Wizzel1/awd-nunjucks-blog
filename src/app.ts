require("dotenv").config();

import express from "express";
import nunjucks from "nunjucks";
import cors from "cors";
import { logger } from "./middleware/loggerMiddleware";
import { BlogEntryModel } from "./models/blogEntryModel";
import publicRoutes from "./routes/publicRoutes";
import adminRoutes from "./routes/adminRoutes";
import { closeDB, connectDB } from "./db/database";
import { BlogService } from "./services/blogService";
import { RedirectsService } from "./services/redirectsService";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);
app.use(express.static("public"));

// Serve EditorJS files from node_modules
app.use('/editorjs', express.static('node_modules/@editorjs/editorjs/dist'));

nunjucks.configure("src/views", {
  autoescape: true,
  express: app,
});

app.use(publicRoutes);
app.use(adminRoutes);

(async () => {
  await connectDB();
  const blogService = new BlogService();
  const redirectsService = new RedirectsService();
  const blogModel = BlogEntryModel.getInstance();
  blogModel.init(blogService, redirectsService);

  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
})();

process.on("SIGINT", async () => {
  await closeDB();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await closeDB();
  process.exit(0);
});