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

    if (!supervisor || supervisor.role !== "Supervisor") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    if (!supervisor.supervisorOfHostel) {
      return res.status(400).json({
        success: false,
        message: "Supervisor hostel not assigned",
      });
    }

    const complaints = await Complaint.find({
      hostel: supervisor.supervisorOfHostel,
      status: { $in: ["Pending", "In_progress"] },
    })
      .populate(
        "student",
        "name registrationNumber roomNumber floor"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      complaints,
    });

  } catch (error) {
    console.error(" getSupervisorComplaints error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export const getAllStudent = async (req, res) => {
  try {
    const supervisor = await User.findById(req.user.id);

    if (!supervisor || supervisor.role !== "Supervisor") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const hostelId = supervisor.supervisorOfHostel;

    if (!hostelId) {
      return res.status(400).json({
        success: false,
        message: "Supervisor not assigned to any hostel",
      });
    }

    // Fetch students and populate the hostel name
    const students = await User.find({
      role: "Student",
      hostel: hostelId,
    })
      .select(
        "name email phone registrationNumber roomNumber floor branch year hostel"
      )
      .populate({
        path: "hostel",
        select: "name", // only get the hostel name
      });

    return res.status(200).json({
      success: true,
      count: students.length,
      students,
    });

  } catch (error) {
    console.error("getAllStudent error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getNotice = async (req, res) => {
  try {

    const student = await User.findById(req.user.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    
    if (!student.hostel) {
      return res.status(400).json({
        success: false,
        message: "Student is not assigned to any hostel",
      });
    }

    
    const notices = await HostelNotice.find({
      hostel: student.hostel,
      $or: [
        { expiryDate: { $gte: new Date() } }, 
        { expiryDate: null }                 
      ]
    })
      .sort({ createdAt: -1 }) 
      .populate("title","description","publishedBy", "name role");

    return res.status(200).json({
      success: true,
      notices,
    });

  } catch (error) {
    console.error("Fetch notice error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
















