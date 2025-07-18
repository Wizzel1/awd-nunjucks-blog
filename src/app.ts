require("dotenv").config();

import express from "express";
import nunjucks from "nunjucks";
import cors from "cors";
import { logger } from "./middleware/loggerMiddleware";
import { BlogEntryModel } from "./models/blogEntryModel";
import publicRoutes from "./routes/publicRoutes";
import adminRoutes from "./routes/adminRoutes";

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
  const blogModel = BlogEntryModel.getInstance();
  await blogModel.init();

  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
})();
