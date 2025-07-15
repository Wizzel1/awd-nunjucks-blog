require("dotenv").config();

import express from "express";
import nunjucks from "nunjucks";
import cors from "cors";
import { logger } from "./middleware/loggerMiddleware";
import aboutController from "./controllers/aboutController";
import indexController from "./controllers/indexController";
import contactController from "./controllers/contactController";
import readPostController from "./controllers/readPostController";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(logger);
app.use(express.static("public"));

nunjucks.configure("templates", {
  autoescape: true,
  express: app,
});

app.get("/", indexController);
app.get("/about.html", aboutController);
app.get("/contact.html", contactController);
app.get("/post/:slug", readPostController); 

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
