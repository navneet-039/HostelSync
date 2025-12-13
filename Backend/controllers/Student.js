import User from "../models/User.js";
import Hostel from "../models/Hostel.js";
import Complaint from "../models/Complaint.js";


export const getAllStudentComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      student: req.user.id,
      status: { $ne: "Resolved" },
    })
      .sort({ date: -1 })
      .populate("student")
      .populate("hostel");

    return res.status(200).json({
      success: true,
      complaints,
      message: "All complaints of students fetched successfully..",
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error while fetching student's complaint...",
    });
  }
};


export const getSupervisorComplaints = async (req, res) => {
  try {
    const supervisor = await User.findById(req.user.id);

    if (!supervisor || !supervisor.hostel) {
      return res.status(400).json({
        success: false,
        message: "Supervisor hostel information missing",
      });
    }

    const complaints = await Complaint.find({
      hostel: supervisor.hostel,
      status: { $in: ["Pending", "In_progress"] },
    })
      .populate("student", "registrationNumber roomNumber floor")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      complaints,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
