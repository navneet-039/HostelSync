import User from "../models/User.js";
import Complaint from "../models/Complaint.js";
import s3 from "../Config/S3.js";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { CopyObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

export const registerComplaint = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    const student = await User.findById(req.user.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // 1️ Create complaint FIRST
    const complaint = await Complaint.create({
      title,
      description,
      category,
      student: student._id,
      hostel: student.hostel,
      images: [],
    });

    const images = [];

    // 2️ Upload images using complaintId
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const key = `complaints/active/${student._id}/${
          complaint._id
        }/${Date.now()}-${file.originalname}`;

        await s3.send(
          new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
          })
        );

        images.push({
          key,
          url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
        });
      }
    }

    // 3️ Save image references
    complaint.images = images;
    await complaint.save();

    return res.status(201).json({
      success: true,
      message: "Complaint registered successfully",
      complaint,
    });
  } catch (error) {
    console.error("registerComplaint error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while registering complaint",
    });
  }
};


