import User from "../models/User.js";
import Complaint from "../models/Complaint.js";
import Hostel from "../models/Hostel.js";
import HostelNotice from "../models/Notice.js";
import sendMail from "../utils/mailSender.js";
import {hostelNoticeEmailTemplate} from "../mailTemplates/noticeMail.js"

export const registerComplaint = async (req, res) => {
  try {
    console.log("hlo from register complaint");
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

    return res.status(201).json({
      success: true,
      message: "Complaint registered successfully",
      complaint,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error while registering complaint",
    });
  }
};

export const updateComplaintStatus = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { status } = req.body;

    if (!["Pending", "In_progress", "Resolved"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const supervisor = await User.findById(req.user.id);

    if (!supervisor || supervisor.role !== "Supervisor") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    if (
      complaint.hostel.toString() !== supervisor.supervisorOfHostel.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    complaint.status = status;
    complaint.assignedBy = supervisor._id;

    await complaint.save();

    return res.status(200).json({
      success: true,
      message: "Complaint status updated",
      complaint,
    });
  } catch (error) {
    console.error("updateComplaintStatus error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const publishNotice = async (req, res) => {
  try {
    const { title, description, expiryDate } = req.body;
    const supervisor = await User.findById(req.user.id);
    if (!supervisor) {
      return res.status(404).json({
        success: false,
        message: "Supervisor not found",
      });
    }

    const hostel = await Hostel.findOne({ supervisor: req.user.id })
      .populate("students", "email name");

    if (!hostel) {
      return res.status(404).json({
        success: false,
        message: "No hostel assigned to this supervisor",
      });
    }

    const notice = await HostelNotice.create({
      title,
      description,
      hostel: hostel._id,
      publishedBy: req.user.id,
      expiryDate,
    });

    for (const student of hostel.students) {
      try {
        const html = hostelNoticeEmailTemplate({
          title,
          description,
          hostelName: hostel.name,
          publishedByName: supervisor.name,
          createdAt: notice.createdAt,
          expiryDate: notice.expiryDate,
        });

        await sendMail(
          student.email,
          `Notice: ${title}`,
          html
        );
      } catch (mailError) {
        console.error(`Mail failed for ${student.email}`, mailError);
      }
    }
    return res.status(201).json({
      success: true,
      message: "Notice published successfully",
      notice,
    });

  } catch (error) {
    console.error("Notice creation error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
