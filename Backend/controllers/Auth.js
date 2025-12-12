import User from "../models/User.js";
import bcrypt from "bcryptjs";
const { sendMail } = require("../utils/sendMail");
const { registerStudentTemplate } = require("../mailTemplates/registerStudent");

const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/tokenGenerator");
const { sendMail } = require("../utils/mailSender.js");

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const ismatched = await bcrypt.compare(password, user.password);
    if (!ismatched) {
      return res.status(401).json({ message: "wrong password" });
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
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({ message: "login sucessfull", accessToken });
  } catch {
    res.status(500).json({ message: "internal error" });
  }
};

exports.registerStudent = async (req, res) => {
  try {
    const { name, registrationNumber, email, password, hostel, room } =
      req.body;

    if (
      !name ||
      !registrationNumber ||
      !email ||
      !password ||
      !hostel ||
      !room
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStudent = await User.create({
      name,
      registrationNumber,
      email,
      password: hashedPassword,
      hostel,
      room,
      role: "Student",
    });

    const resetLink = "https://localhost5000/reset-password?email=${email}";

    const html = registerStudentTemplate(
      email,
      password,
      registrationNumber,
      hostel,
      room,
      resetLink
    );

    await sendMail(newStudent.email, "Registration Successful", html);

    return res.status(201).json({
      success: true,
      message: "Student registered successfully",
      student: {
        id: newStudent._id,
        name: newStudent.name,
        email: newStudent.email,
        registrationNumber: newStudent.registrationNumber,
        hostel: newStudent.hostel,
        room: newStudent.room,
      },
    });
  } catch (error) {
    console.log("Registration Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;

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
      student: existingUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error while changing password",
    });
  }
};




