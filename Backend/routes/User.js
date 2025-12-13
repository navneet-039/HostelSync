import express from "express";
import { auth,isStudent,isSupervisor } from "../middlewares/Auth.js";
import { loginController, registerStudent, changePassword,refreshAccessToken ,createSupervisor,createHostel} from "../controllers/Auth.js";

const router = express.Router();

router.post("/login", loginController);
router.post("/register",isSupervisor, registerStudent);
router.patch("/change-password", auth,isStudent, changePassword);
router.get("/refresh-token",isStudent, refreshAccessToken);
router.post("/create-supervisor",createSupervisor);
router.post("/create-hostel",createHostel);

export default router;
