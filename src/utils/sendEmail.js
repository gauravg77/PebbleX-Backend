import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.resend.com",
    port: 587,
    auth: {
      user: "resend",
      pass: process.env.RESEND_API_KEY
    }
  });

  // For testing: using verified email as the recipient
  const recipientEmail = process.env.VERIFIED_EMAIL || "ghimiregaurav357@gmail.com";

  const mailOptions = {
    from: process.env.EMAIL_FROM || "onboarding@resend.dev",
    to: recipientEmail, // Using verified email for testing
    subject: options.subject,
    text: options.message
  };

  try {
    console.log("Sending email to:", recipientEmail);
    const result = await transporter.sendMail(mailOptions);
const info = await transporter.sendMail(mailOptions);
console.log(`Email sent successfully to: ${info.accepted[0]}`);
    return { success: true, result };
  } catch (error) {
    console.error("Error sending email:", error.message);
    return { success: false, error: error.message };
  }
};

export default sendEmail;
