import express from "express";
import { auth } from "../middlewares/Auth.js";
import { registerComplaint, updateComplaintStatus } from "../controllers/Complaint.js";

const router = express.Router();

router.post("/register", auth, registerComplaint);
router.patch("/status/:complaintId", auth, updateComplaintStatus);

export default router;
