import express from "express";
import { getAllStudent, getAllStudentComplaints, getNotice, getSupervisorComplaints } from "../controllers/Student.js";
import { auth, isStudent, isSupervisor } from "../middlewares/Auth.js";
import { publishNotice } from "../controllers/Complaint.js";

const router = express.Router();

router.get("/student/complaints", auth, isStudent, getAllStudentComplaints);
router.get("/hostel/complaints", auth, isSupervisor, getSupervisorComplaints);
router.get("/Allstudent",auth,isSupervisor,getAllStudent);
router.post("/setnotice",auth,isSupervisor,publishNotice)
router.get("/seeNotice",auth,isSupervisor,getNotice);
export default router;
