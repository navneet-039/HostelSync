import express from "express";
import { auth,isSupervisor,isStudent } from "../middlewares/Auth.js";
import { registerComplaint, updateComplaintStatus } from "../controllers/Complaint.js";
import { getAllStudent } from "../controllers/Supervisor.js";
import upload from "../middlewares/multer.js";

const router = express.Router();
 

router.post(
  "/register",
  auth,
  isStudent,
  upload.array("images", 5),
  registerComplaint
);


router.patch("/status/:complaintId", auth,isSupervisor, updateComplaintStatus,getAllStudent);


export default router;
