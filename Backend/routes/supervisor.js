import express from "express";
import { getAllStudent, getAllStudentComplaints, getSupervisorComplaints } from "../controllers/Student.js";
import { auth, isStudent, isSupervisor } from "../middlewares/Auth.js";

const router = express.Router();

router.get("/student/complaints", auth, isStudent, getAllStudentComplaints);
router.get("/hostel/complaints", auth, isSupervisor, getSupervisorComplaints);
router.get("/Allstudent",auth,isSupervisor,getAllStudent);

export default router;
