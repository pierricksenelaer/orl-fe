import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
// require("dotenv").config();

const SES_CONFIG = {
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: "us-east-2",
};

const sesClient = new SESClient(SES_CONFIG);

export const sendAWSEmail = async (recipientEmail, name) => {
  let params = {
    Source: "netralabs.system@gmail.com",
    Destination: {
      ToAddresses: [recipientEmail],
    },
    ReplyToAddresses: [],
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `<h1>Hello!</h1>`,
        },
        Text: {
          Charset: "UTF-8",
          Data: `This is my email's body!`,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: `This is my email's subject!`,
      },
    },
  };

  try {
    const sendEmailCommand = new SendEmailCommand(params);
    const res = await sesClient.send(sendEmailCommand);
    console.log("Email has been sent!", res);
  } catch (error) {
    console.log(error);
  }
};
