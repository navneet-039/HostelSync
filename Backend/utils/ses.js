import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const ses = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

// //export const sendMail = async ({ to, subject, html }) => {
//   console.log("hiii from send mail controller");
//   await ses.send(
//     new SendEmailCommand({
//       Source: process.env.SES_FROM_MAIL,
//       Destination: { ToAddresses: [to] },
//       Message: {
//         Subject: { Data: subject },
//         Body: { Html: { Data: html } },
//       },
//     })
//   );
// };
