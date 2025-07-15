require("dotenv").config();

import express from "express";
import nunjucks from "nunjucks";
import cors from "cors";
import { logger } from "./middleware/loggerMiddleware";
import { BlogEntryModel, modelMiddleware } from "./models/blogEntryModel";
import publicRoutes from "./routes/publicRoutes";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(logger);
app.use(modelMiddleware);
app.use(express.static("public"));

nunjucks.configure("views", {
  autoescape: true,
  express: app,
});

app.use(publicRoutes);

(async () => {
  const blogModel = BlogEntryModel.getInstance();
  await blogModel.init();

  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
})();
