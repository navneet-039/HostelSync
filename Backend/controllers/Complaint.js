
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