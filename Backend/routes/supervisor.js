import express from "express";
import { getAllStudentComplaints, getSupervisorComplaints } from "../controllers/Student.js";
import { auth, isStudent, isSupervisor } from "../middlewares/Auth.js";

const router = express.Router();

router.get("/student/complaints", auth, isStudent, getAllStudentComplaints);
router.get("/hostel/complaints", auth, isSupervisor, getSupervisorComplaints);

export default router;
