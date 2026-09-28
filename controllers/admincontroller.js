import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const allapplications = async (req, res) => {
  try {
    const app = await prisma.appointment.findMany({
      orderBy: { starttime: "asc" },
      include: {
        user: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
            phone: true,
          },
        },
      },
    });
    return res.status(200).json(app);
  } catch (e) {
    console.error("Error fetching appointments:", e);
    return res.status(500).json({ message: "Database query failed", details: e.message });
  }
};

export const aprove = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ message: "Invalid appointment ID" });
    }

    const app = await prisma.appointment.update({
      where: { id: Number(id) },
      data: { status: "approved" },
    });

    return res.status(200).json(app);
  } catch (e) {
    console.error("Error approving appointment:", e);
    return res.status(500).json({ message: "Failed to approve appointment", details: e.message });
  }
};

export const cancel = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ message: "Invalid appointment ID" });
    }

    const app = await prisma.appointment.update({
      where: { id: Number(id) },
      data: { status: "canceled" },
    });

    return res.status(200).json(app);
  } catch (e) {
    console.error("Error canceling appointment:", e);
    return res.status(500).json({ message: "Failed to cancel appointment", details: e.message });
  }
};

export const rechedule = async (req, res) => {
  try {
    const { id, starttime, endtime } = req.body;
    if (!id || !starttime || !endtime) {
      return res.status(400).json({ message: "Invalid or missing appointment data" });
    }

    const app = await prisma.appointment.update({
      where: { id: Number(id) },
      data: {
        starttime: new Date(starttime),
        endtime: new Date(endtime),
      },
    });

    return res.status(200).json(app);
  } catch (e) {
    console.error("Error rescheduling appointment:", e);
    return res.status(500).json({ message: "Failed to reschedule appointment", details: e.message });
  }
};