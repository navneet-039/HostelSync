
const User = require("../models/User");
const Complaint = require("../models/Complaint");

exports.registerComplaint = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    
    const student = await User.findById(req.user.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const complaint = await Complaint.create({
      title,
      description,
      category,
      student: student._id,
      hostel: student.hostel,
    });

    res.status(201).json({
      success: true,
      message: "Complaint registered successfully",
      complaint,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error while registering complaint",
    });
  }
};
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { status } = req.body;

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ success: false, message: "Complaint not found" });
    }

    // current status
    const current = complaint.status;
    const next = status;

    const allowed = {
      "Pending": "In_progress",
      "In_progress": "Resolved",
      "Resolved": null
    };

    // Check if transition is allowed
    if (allowed[current] !== next) {
      return res.status(400).json({
        success: false,
        message: `Invalid transition: ${current} → ${next} not allowed`
      });
    }

    complaint.status = next;
    await complaint.save();

    res.status(200).json({ success: true, message: "Status updated", complaint });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


