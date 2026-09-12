import { PrismaClient } from "@prisma/client";
import { appointmentSchema, updateAppointmentSchema } from "../schemas/appointmentSchema.js";

const prisma = new PrismaClient();

const getUserId = (req) => {
  const rawId = req.user?.id || req.user?.userId;
  if (!rawId) return null;
  return isNaN(Number(rawId)) ? rawId : Number(rawId);
};

export const createAppointment = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: Invalid user payload" });
    }

    const result = appointmentSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "Invalid appointment data",
        errors: result.error.issues,
      });
    }

    const { starttime, endtime } = result.data;
    const newstarttime = new Date(starttime);
    const newendtime = new Date(endtime);

    const hour = newstarttime.getHours();
    if (hour < 9 || hour > 17) {
      return res.status(400).json({ message: "Appointments must be scheduled between 9 AM and 5 PM" });
    }

    const existingConflict = await prisma.appointment.findFirst({
      where: {
        starttime: { lt: newendtime },
        endtime: { gt: newstarttime },
      },
    });

    if (existingConflict) {
      return res.status(409).json({ message: "Time slot already booked" });
    }

    const appoint = await prisma.appointment.create({
      data: {
        starttime: newstarttime,
        endtime: newendtime,
        status: "pending",
        userid: userId,
      },
    });

    return res.status(201).json(appoint);
  } catch (error) {
    console.error("Error creating appointment:", error);
    return res.status(500).json({ message: "Failed to create appointment", details: error.message });
  }
};

export const getAppointment = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Invalid user token payload" });
    }

    const appointments = await prisma.appointment.findMany({
      where: { userid: userId },
      orderBy: { starttime: "asc" },
    });

    return res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return res.status(500).json({ message: "Database query failed", details: error.message });
  }
};

export const updateAppointment = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Use updateAppointmentSchema instead of appointmentSchema
    const result = updateAppointmentSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "Invalid appointment data",
        errors: result.error.issues,
      });
    }

    const appid = Number(req.params.id);

    const find = await prisma.appointment.findFirst({
      where: {
        id: appid,
        userid: userId,
      },
    });

    if (!find) {
      return res.status(404).json({ message: "Appointment not found or unauthorized" });
    }

    const { starttime, endtime, status } = result.data;

    const updated = await prisma.appointment.update({
      where: { id: appid },
      data: {
        ...(starttime && { starttime: new Date(starttime) }),
        ...(endtime && { endtime: new Date(endtime) }),
        ...(status && { status }),
      },
    });

    return res.status(200).json({ updated });
  } catch (error) {
    console.error("Error updating appointment:", error);
    return res.status(500).json({ message: "Failed to update appointment", details: error.message });
  }
};