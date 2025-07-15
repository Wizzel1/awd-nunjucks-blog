import { Router } from "express";

import indexController from "../controllers/indexController";
import aboutController from "../controllers/aboutController";
import contactController from "../controllers/contactController";
import readPostController from "../controllers/readPostController";

const router = Router();

router.get("/", indexController);
router.get("/about.html", aboutController);
router.get("/contact.html", contactController);
router.get("/post/:slug", readPostController);

export default router;