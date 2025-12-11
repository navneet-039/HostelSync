import User from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/tokenGenerator");



export  const loginController=async(req,res)=>{
    try{
        const {email,password}=req.body;
        const user= await User.findOne({email});
        if(!user){
            return res.status(404).json({message:"user not found"})

        }
        const ismatched=await bcrypt.compare(password,user.password);
        if(!ismatched){
            return res.status(401).json({message:"wrong password"});
        }
        const accessToken=jwt.sign({
            id:user._id,email:user.email

        },process.env.ACCESSSECRET,{
            expiresIn:"15m"


        });
        const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" }
    );
    user.refreshToken = refreshToken;
    await user.save();
    generateAccessToken();
  generateRefreshToken();
    res.cookies("refreshToken",refreshToken,{
        httpOnly:true,
        secure:True,
        sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,

        



    });
    return res.status(200).json({message:"login sucessfull",accessToken})



    }
    catch{
        res.status(500).json({message:"internal error"});
    }

}