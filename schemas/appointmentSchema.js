import { z } from "zod";

export const appointmentSchema = z.object({
  starttime: z.string().datetime(),
  endtime: z.string().datetime(),
});

export const updateAppointmentSchema = z.object({
  starttime: z.string().datetime().optional(),
  endtime: z.string().datetime().optional(),
  status: z.string().optional(),
});