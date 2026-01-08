import {
  ReceiveMessageCommand,
  DeleteMessageCommand,
} from "@aws-sdk/client-sqs";
import { complaintTemplate } from "../mailTemplates/complaintTemplate.js";

import Complaint from "../models/Complaint.js";
import { sendMail } from "../utils/ses.js";
import { sqs } from "../utils/sqs.js";

export const startComplaintEmailWorker = async () => {
  while (true) {
    const res = await sqs.send(
      new ReceiveMessageCommand({
        QueueUrl: process.env.SQS_QUEUE_URL,
        MaxNumberOfMessages: 1,
        WaitTimeSeconds: 20,
      })
    );

    if (!res.Messages || res.Messages.length === 0) {
      continue;
    }

    for (const msg of res.Messages) {
      try {
        const { complaintId, supervisorEmail } = JSON.parse(msg.Body);
        const complaint = await Complaint.findById(complaintId).populate(
          "student"
        );

        if (!complaint) {
          console.error(" Complaint not found:", complaintId);
          continue;
        }
        await sendComplaintMail({
          to: supervisorEmail,
          subject: "New Hostel Complaint",
          html: complaintTemplate(
            complaint.title,
            complaint.description,
            complaint.student.name,
            complaint.student.email,
          ),
        });

        await sqs.send(
          new DeleteMessageCommand({
            QueueUrl: process.env.SQS_QUEUE_URL,
            ReceiptHandle: msg.ReceiptHandle,
          })
        );

        console.log(" Email sent & message deleted");
      } catch (err) {
        console.error(" Email worker error:", err);
      }
    }
  }
};
