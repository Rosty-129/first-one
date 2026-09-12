import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "rosanza12@gmail.com",
    pass: "hicb ixuf uafk qhrn",
  },
});

const getUserId = (req) => {
  const rawId = req.user?.id || req.user?.userId;
  if (!rawId) return null;
  return isNaN(Number(rawId)) ? rawId : Number(rawId);
};

// Register new user
export const createUser = async (req, res) => {
  try {
    const { firstname, lastname, phone, date, location, email, password } = req.body;

    if (!email || !password || !firstname || !lastname) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
const codeExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

    const newUser = await prisma.user.create({
      data: {
        firstname,
        lastname,
        phone,
        date: date || null, // Saved directly as String
        location,
        email,
        password: hashedPassword,
        isVerified : false,
        verificationCode,
        codeExpiresAt,
      },
    });

await transporter.sendMail({
  from: "rosanza12@gmail.com",
  to:email,
  subject:"Verify your account",
  text:`Hello ${firstname},\n\nYour verification code is: ${verificationCode}\nIt expires in 15 minutes.`,
});


    return res.status(201).json({ message: "Registration successful", userId: newUser.id });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Server error", details: error.message });
  }
};

export const verifyCode = async (req,res) => {
  try {
    const {email , code} = req.body;

if (!email || !code){
  return res.status(400).json({message : "email and code are required"});
}

const user = await prisma.user.findUnique({where : {email}});

if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User is already verified" });
    }

    if (user.verificationCode !== code) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    if (new Date() > user.codeExpiresAt) {
      return res.status(400).json({ message: "Verification code has expired" });
    }

    await prisma.user.update({
      where: { email },
      data: {
        isVerified: true,
        verificationCode: null,
        codeExpiresAt: null,
      },
    });

    return res.status(200).json({ message: "Account successfully verified!" });

}catch (error) {
    console.error("Error verifying code:", error);
    return res.status(500).json({ message: "Server error", details: error.message });
  }
};


// Get logged-in user profile
export const getProfile = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        date: true,
        phone: true,
        location: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return res.status(500).json({ message: "Server error", details: error.message });
  }
};

// Update logged-in user profile
export const updateProfile = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { firstname, lastname, email, date, phone, location, currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let updatedPasswordHash = user.password;

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: "Current password is required to set a new password" });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Incorrect current password" });
      }

      updatedPasswordHash = await bcrypt.hash(newPassword, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(firstname && { firstname }),
        ...(lastname && { lastname }),
        ...(email && { email }),
        ...(date && { date: String(date) }), // Passed as String to match Prisma schema
        ...(phone && { phone }),
        ...(location && { location }),
        password: updatedPasswordHash,
      },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        date: true,
        phone: true,
        location: true,
      },
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: "Failed to update profile", details: error.message });
  }
};