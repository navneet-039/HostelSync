const express = require("express");
const router = express.Router();

const { auth } = require("../middlewares/Auth");
const {
  registerComplaint,
  updateComplaintStatus,
} = require("../controllers/Controller");


router.post("/register", auth, registerComplaint);


router.patch("/status/:complaintId", auth, updateComplaintStatus);

module.exports = router;
