import express from "express";
import { auth } from "../middlewares/Auth.js";
import { loginController, registerStudent, changePassword } from "../controllers/Auth.js";

const router = express.Router();

router.post("/login", loginController);
router.post("/register", registerStudent);
router.patch("/change-password", auth, changePassword);

export default router;
