import { Router } from "express";
import adminController from "../controllers/admin/adminController";
import { showEditForm, updatePost } from "../controllers/admin/editPostController";

const router = Router();

router.get("/admin", adminController);
router.get("/admin/posts/edit/:slug", showEditForm);
router.put("/admin/posts/edit/:slug", updatePost);

export default router;