import express from "express";
import { isAdmin, verify } from "../middleware.js";
import {
  allapplications,
  aprove,
  cancel,
  rechedule,
} from "../controllers/admincontroller.js";

const router = express.Router();

router.get("/appointments", verify, isAdmin, allapplications);
router.patch("/appointments/aprove", verify, isAdmin, aprove);
router.patch("/appointments/cancel", verify, isAdmin, cancel);
router.patch("/appointments/reschedule", verify, isAdmin, rechedule);

export default router;