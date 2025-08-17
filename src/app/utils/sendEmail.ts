import nodemailer from "nodemailer";
import config from "../config/index.js";
export const sendEmail = async (to: string, html: string) => {
  // Create a test account or replace with real credentials.
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: config.node_env === "production",
    auth: {
      user: config.email,
      pass: config.app_pass,
    },
  });
  await transporter.sendMail({
    from: ' "University App" <awzbpl@gmail.com>',
    to,
    subject: "Reset Password Link",
    text: "Reset Your Password Within 5 Minutes",
    html,
  });
};
