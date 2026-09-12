import express from "express";
import { login, forgotPassword, resetPassword } from "../controllers/authController.js";

const router = express.Router();

router.post("/", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;