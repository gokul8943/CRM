import { Router } from "express";
import { getUserProfile, updateUserProfile } from "./userController";
import { authenticateToken } from "../../middleware/Auth";


const router = Router();

router.get("/profile", authenticateToken, getUserProfile);
router.put("/profile", authenticateToken, updateUserProfile);
export default router;