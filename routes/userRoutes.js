import express from "express";
import verify from "../middleware/verify.js";
import { createUser, getProfile, updateProfile ,verifyCode} from "../controllers/userController.js";

const router = express.Router();

// Public route for user registration (matches fetch("http://127.0.0.1:5005/user", { method: "POST" }))
router.post("/", createUser);

router.post("/register", createUser);
router.post("/verify", verifyCode);

// Protected profile routes
router.get("/me", verify, getProfile);
router.patch("/update", verify, updateProfile);

export default router;