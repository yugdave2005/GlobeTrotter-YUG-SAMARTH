import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  auth: {
    user: process.env.BREVO_SMTP_USER || 'your-brevo-registered-email@domain.com',
    pass: process.env.BREVO_SMTP_KEY || process.env.BREVO_API_KEY,
  },
});

export const sendOTP = async (toEmail, otpCode) => {
  const mailOptions = {
    from: '"GlobeTrotter" <no-reply@globetrotter.com>',
    to: toEmail,
    subject: 'Your Password Reset OTP',
    text: `Your OTP for password reset is: ${otpCode}. It is valid for 10 minutes.`,
    html: `<p>Your OTP for password reset is: <strong>${otpCode}</strong></p><p>It is valid for 10 minutes.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return false;
  }
};
