import express from "express";
import verify from "../middleware/verify.js";

import {
  createAppointment,
  getAppointment,
  updateAppointment,
} from "../controllers/appointmentController.js";

const router = express.Router();

router.post("/", verify, createAppointment);

router.get("/", verify, getAppointment);

router.patch("/:id", verify, updateAppointment);

export default router;