const express = require("express");
const router = express.Router();

const {
  getAllStudentComplaints,
  getSupervisorComplaints,
} = require("../controllers/complaintController");

const { auth } = require("../middleware/auth");
const { isStudent, isSupervisor } = require("../middleware/roles");



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
