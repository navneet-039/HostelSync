import {
  ReceiveMessageCommand,
  DeleteMessageCommand,
} from "@aws-sdk/client-sqs";

import Complaint from "../models/Complaint.js";
import { sendComplaintMail } from "../utils/ses.js";
import {sqs} from "../utils/sqs.js";

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
          html: `
            <h2>${complaint.title}</h2>
            <p>${complaint.description}</p>
            <p><b>Student:</b> ${complaint.student.name}</p>
          `,
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
