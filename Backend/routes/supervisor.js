const express = require("express");
const router = express.Router();

const {
  getAllStudentComplaints,
  getSupervisorComplaints,
} = require("../controllers/Complaint");

const { auth } = require("../middleware/Auth");
const { isStudent, isSupervisor } = require("../middlewares/Auth");



router.get(
  "/student/complaints",
  auth,
  isStudent,
  getAllStudentComplaints
);


router.get(
  "/supervisor/complaints",
  auth,
  isSupervisor,
  getSupervisorComplaints
);

module.exports = router;
