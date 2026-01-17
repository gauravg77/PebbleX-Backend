// src/utils/sendEmail.js
import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525, // Standard secure port to avoid ISP blocks
    auth: {
      user: "9cd751e7300c0e",
      pass: "52185ab29f4b1f"
    },
    connectionTimeout: 10000 // 10 seconds timeout
  });

  // 2) Define the email options
  const mailOptions = {
    from: '"PebbleX Support" <support@pebblex.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3) Actually send the email
  return await transporter.sendMail(mailOptions);
};

export default sendEmail;