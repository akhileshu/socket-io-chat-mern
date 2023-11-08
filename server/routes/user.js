import express from "express";
import { authUser, getAllUsers, registerUser } from "../controllers/user.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
// url ->root/api/user
router.post("/", registerUser).post("/login", authUser).get("/",protect, getAllUsers);
export default router;
