import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/tokenGenerator");

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

    const resetLink = `https://localhost5000/reset-password?email=${email}`;

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
 exports.changePassword=async(req,res)=>{
  
  let {email,oldpassword,newpassword}=req.body;
  try{
  const user=User.findOne({email});
  if(!user){
    res.status(401).json({success:false,message:"invalid user"});
  }
  const ismatched=await bcrypt.compare(oldpassword,user.password);
  if(!ismatched){
    res.status(400).json({success: false,message:"invalid password"});
  }
  const hashedpassword=await bcrypt.hash(newpassword,10);
  user.password=hashedpassword;
  user.save();
  return res.status(200).json({success: true,message:"user password changed successfully"});

 }
catch(err){
  console.log(err);
  res.status(500).json({success: false,message:"something wrong"})

}}