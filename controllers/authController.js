import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { authSchema, forgotPasswordSchema, resetPasswordSchema } from "../schemas/authSchema.js";

const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "rosanza12@gmail.com",
    pass: "hicb ixuf uafk qhrn",
  },
});

export const login = async (req, res) => {
  const result = authSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Invalid data",
      errors: result.error.issues,
    });
  }

  const { email, password } = result.data;

  const user = await prisma.user.findUnique({
    where: { email: email },
  });

  if (!user) {
    return res.status(401).json({ message: "invalid" });
  }

  const hashed = await bcrypt.compare(password, user.password);

  if (!hashed) {
    return res.status(401).json({ message: "invalid" });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.status(200).json({ token: token });
};

export const forgotPassword = async (req, res) => {
  const result = forgotPasswordSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ message: "Invalid data", errors: result.error.issues });
  }

  const { email } = result.data;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const codeExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await prisma.user.update({
    where: { email },
    data: { verificationCode: resetCode, codeExpiresAt },
  });

  await transporter.sendMail({
    from: "rosanza12@gmail.com",
    to: email,
    subject: "Reset your password",
    text: `Your password reset code is: ${resetCode}\nIt expires in 15 minutes.`,
  });

  return res.status(200).json({ message: "Reset code sent to email." });
};

export const resetPassword = async (req, res) => {
  const result = resetPasswordSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ message: "Invalid data", errors: result.error.issues });
  }

  const { email, code, newPassword } = result.data;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.verificationCode !== code) return res.status(400).json({ message: "Invalid code" });
  if (new Date() > user.codeExpiresAt) return res.status(400).json({ message: "Code expired" });

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { email },
    data: {
      password: hashedPassword,
      verificationCode: null,
      codeExpiresAt: null,
    },
  });

  return res.status(200).json({ message: "Password updated successfully!" });
};