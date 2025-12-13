import express from "express";
import { auth } from "../middlewares/Auth.js";
import { loginController, registerStudent, changePassword,refreshAccessToken } from "../controllers/Auth.js";

const router = express.Router();

router.post("/login", loginController);
router.post("/register", registerStudent);
router.patch("/change-password", auth, changePassword);
router.get("/refresh-token", refreshAccessToken);

export default router;
