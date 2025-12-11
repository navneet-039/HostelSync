const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.auth = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access token missing or invalid",
      });
    }
    const accessToken = authorizationHeader.split(" ")[1];
    const decode = jwt
      .verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
      .select("-password");
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

exports.isStudent = async (req, res, next) => {
  try {
    if (req.user.role !== "Student") {
      return res.status(401).json({
        success: false,
        message: "Route not allowed to students",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.isSupervisor = async (req, res, next) => {
  try {
    if (req.user.role !== "Supervisor") {
      return res.status(401).json({
        success: false,
        message: "Route not allowed to supervisor",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.isWarden = async (req, res, next) => {
  try {
    if (req.user.role !== "Chief_warden") {
      return res.status(401).json({
        success: false,
        message: "Route not allowed to Chief_warden",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
