import User from "../models/User.js";
import Complaint from "../models/Complaint.js";
import bcrypt from "bcryptjs";
import sendMail from "../utils/mailSender.js";
import Hostel from "../models/Hostel.js";
import jwt from "jsonwebtoken";
import { registerStudentTemplate } from "../mailTemplates/registrantionMail.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/tokenGenerator.js";

export const loginController = async (req, res) => {
  try {
    console.log("hii");
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res.status(401).json({ message: "Wrong password" });
    }

    const payload = {
      email: user.email,
      id: user._id,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const registerStudent = async (req, res) => {
  try {
    console.log("Register Student API");

    const {
      name,
      email,
      phone,
      registrationNumber,
      password,
      branch,
      year,
      roomNumber,
      floor, // NEW FIELD
    } = req.body;

    // Validate all fields
    if (
      !name ||
      !email ||
      !phone ||
      !registrationNumber ||
      !password ||
      !branch ||
      !year ||
      !roomNumber
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check for existing user
    const existingUser = await User.findOne({
      $or: [{ email }, { registrationNumber }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Student already registered",
      });
    }

    // Check supervisor
    const supervisor = await User.findById(req.user.id).populate(
      "supervisorOfHostel"
    );

    if (!supervisor || supervisor.role !== "Supervisor") {
      return res.status(403).json({
        success: false,
        message: "Only supervisors can register students",
      });
    }

    if (!supervisor.supervisorOfHostel) {
      return res.status(400).json({
        success: false,
        message: "Supervisor hostel not assigned",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create student
    const student = await User.create({
      name,
      email,
      phone,
      registrationNumber,
      password: hashedPassword,
      branch,
      year,
      roomNumber,
      floor, // STORE FLOOR
      hostel: supervisor.supervisorOfHostel._id,
      role: "Student",
    });

    const resetLink = `http://localhost:5173/reset-password?email=${email}`;

    const html = registerStudentTemplate(
      email,
      password,
      registrationNumber,
      supervisor.supervisorOfHostel.name,
      roomNumber,
      resetLink,
      floor // optionally pass floor to template
    );

    await sendMail(email, "Student Registration Successful", html);

    return res.status(201).json({
      success: true,
      message: "Student registered successfully",
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        phone: student.phone,
        registrationNumber: student.registrationNumber,
        branch: student.branch,
        year: student.year,
        roomNumber: student.roomNumber,
        floor: student.floor, // RETURN FLOOR
        hostel: supervisor.supervisorOfHostel.name,
      },
    });
  } catch (error) {
    console.error("Register Student Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    console.log("hii from change pass");
    const { email, oldPassword, newPassword } = req.body;
    console.log("hii after change pass");

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User does not exist",
      });
    }

    const isPasswordMatched = await bcrypt.compare(
      oldPassword,
      existingUser.password
    );

    if (!isPasswordMatched) {
      return res.status(400).json({
        success: false,
        message: "Wrong old password",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    existingUser.password = hashedPassword;
    await existingUser.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error while changing password",
    });
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token missing" });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const accessToken = generateAccessToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    return res.json({
      accessToken,
      user,
    });
  } catch {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};


export const createSupervisor = async (req, res) => {
  try {
    const { name, email, phone, password, hostelName } = req.body;

    if (!name || !email || !phone || !password || !hostelName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hostel = await Hostel.findOne({ name: hostelName });
    if (!hostel) {
      return res.status(404).json({ message: "Hostel not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const supervisor = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "Supervisor",
      supervisorOfHostel: hostel._id,
    });

    // Update hostel to link supervisor
    hostel.supervisor = supervisor._id;
    await hostel.save();

    res.status(201).json({
      message: "Supervisor created successfully",
      supervisor: {
        id: supervisor._id,
        name: supervisor.name,
        email: supervisor.email,
        hostel: hostel.name,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createHostel = async (req, res) => {
  try {
    const { name, capacity } = req.body;

    if (!name || !capacity) {
      return res
        .status(400)
        .json({ message: "Name and capacity are required" });
    }

    const existingHostel = await Hostel.findOne({ name });
    if (existingHostel) {
      return res.status(400).json({ message: "Hostel already exists" });
    }

    const hostel = await Hostel.create({
      name,
      capacity,
    });

    res.status(201).json({
      message: "Hostel created successfully",
      hostel: {
        id: hostel._id,
        name: hostel.name,
        capacity: hostel.capacity,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const logoutUser = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) return res.sendStatus(204);

    const user = await User.findOne({ refreshToken });
    if (user) {
      user.refreshToken = null;
      await user.save();
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Logout failed" });
  }
};
