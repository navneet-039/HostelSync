
import { ReceiveMessageCommand, DeleteMessageCommand } from "@aws-sdk/client-sqs";
import { sqs } from "../utils/sqs.js";
import sendMail from "../utils/mailSender.js";

export const startNoticeEmailWorker = async () => {
  console.log("Notice Email Worker started");

  while (true) {
    const res = await sqs.send(
      new ReceiveMessageCommand({
        QueueUrl: process.env.NOTICE_SQS_QUEUE_URL,
        MaxNumberOfMessages: 5,
        WaitTimeSeconds: 20,
      })
    );

    if (!res.Messages || res.Messages.length === 0) continue;

    for (const msg of res.Messages) {
      try {
        const { to, subject, html } = JSON.parse(msg.Body);

        await sendMail(to, subject, html);

        await sqs.send(
          new DeleteMessageCommand({
            QueueUrl: process.env.NOTICE_SQS_QUEUE_URL,
            ReceiptHandle: msg.ReceiptHandle,
          })
        );

        console.log(`Notice email sent to ${to}`);
      } catch (err) {
        console.error("Notice Email Worker error:", err);
      }
    }
  }
};
