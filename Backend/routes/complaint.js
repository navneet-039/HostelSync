import express from "express";
import { auth,isSupervisor,isStudent } from "../middlewares/Auth.js";
import { registerComplaint, updateComplaintStatus } from "../controllers/Complaint.js";
import { getAllStudent } from "../controllers/Student.js";

const router = express.Router();

router.post("/register", auth,isStudent, registerComplaint);
router.patch("/status/:complaintId", auth,isSupervisor, updateComplaintStatus,getAllStudent);


export default router;
