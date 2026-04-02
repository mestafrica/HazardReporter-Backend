import nodemailer from "nodemailer";
import { createTransport } from "nodemailer";



export const mailTransport = nodemailer.createTransport({
  // pool: true,
  host: process.env.SMTP_HOST,
  port: parseInt(`process.env.SMTP_PORT`),
  secure: false, 
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD
  }
   // from: process.env.SMTP_EMAIL_FROM
});

