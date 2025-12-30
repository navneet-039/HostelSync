import User from "../models/User.js";
import Hostel from "../models/Hostel.js";
import Complaint from "../models/Complaint.js";
import HostelNotice from "../models/Notice.js"


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
    // 1️⃣ Fetch logged-in user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 2️⃣ Allow only Student & Supervisor
    let hostelId;

    if (user.role === "Student") {
      if (!user.hostel) {
        return res.status(400).json({
          success: false,
          message: "Student is not assigned to any hostel",
        });
      }
      hostelId = user.hostel;
    } 
    else if (user.role === "Supervisor") {
      if (!user.supervisorOfHostel) {
        return res.status(400).json({
          success: false,
          message: "Supervisor is not assigned to any hostel",
        });
      }
      hostelId = user.supervisorOfHostel;
    } 
    else {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // 3️⃣ Fetch only active + non-expired notices
    const notices = await HostelNotice.find({
      hostel: hostelId,
      isActive: true,
      $or: [
        { expiryDate: { $gte: new Date() } }, // not expired
        { expiryDate: null },                 // no expiry
      ],
    })
      .sort({ createdAt: -1 })
      .populate("publishedBy", "name role")
      .populate("hostel", "name");

    // 4️⃣ Send response
    return res.status(200).json({
      success: true,
      count: notices.length,
      notices,
    });

  } catch (error) {
    console.error("Get Notice Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


