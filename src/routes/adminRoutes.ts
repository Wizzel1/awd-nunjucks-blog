import { Router } from "express";
import adminController from "../controllers/admin/adminController";

const router = Router();

router.get("/admin", adminController);

export default router;