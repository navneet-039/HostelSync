
const express = require("express");
const router = express.Router();

const { auth } = require("../middlewares/Auth");

const {
  loginController,
  registerStudent,
  changePassword,
} = require("../controllers/userController");


router.post("/login", loginController);


router.post("/register", registerStudent);


router.patch("/change-password", auth, changePassword);

module.exports = router;
