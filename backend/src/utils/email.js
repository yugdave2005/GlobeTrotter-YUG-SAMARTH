import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Generate a styled HTML email template for GlobeTrotter OTP
 */
const getOtpEmailHtml = (otpCode) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset - GlobeTrotter</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b;">
    <div style="max-width: 540px; margin: 40px auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #f1f5f9;">
      <!-- Header Banner -->
      <div style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 50%, #4338ca 100%); padding: 36px 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">✈️ GlobeTrotter</h1>
        <p style="color: #e0f2fe; margin: 6px 0 0 0; font-size: 13px; font-weight: 500;">Your Journey, Intelligently Planned</p>
      </div>

      <!-- Main Content -->
      <div style="padding: 36px 32px; text-align: center;">
        <h2 style="font-size: 20px; font-weight: 700; color: #0f172a; margin-top: 0;">Password Reset Code</h2>
        <p style="font-size: 14px; color: #64748b; line-height: 1.6; margin: 12px 0 24px 0;">
          We received a request to reset the password for your GlobeTrotter account. Use the 6-digit verification code below:
        </p>

        <!-- 6-Digit OTP Box -->
        <div style="background: #f0f9ff; border: 2px dashed #0284c7; border-radius: 16px; padding: 18px 24px; display: inline-block; margin: 8px 0 24px 0;">
          <span style="font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #0369a1; font-family: monospace;">${otpCode}</span>
        </div>

        <p style="font-size: 12px; color: #94a3b8; margin: 0 0 20px 0;">
          ⏱️ This code will expire in <strong>10 minutes</strong>.
        </p>

        <div style="border-top: 1px solid #f1f5f9; padding-top: 20px; text-align: left;">
          <p style="font-size: 12px; color: #64748b; margin: 0; line-height: 1.5;">
            🔒 If you did not request this password reset, please ignore this email or reach out to support. Your password will remain unchanged.
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div style="background: #f8fafc; padding: 18px; text-align: center; border-top: 1px solid #f1f5f9;">
        <p style="font-size: 11px; color: #94a3b8; margin: 0;">
          © ${new Date().getFullYear()} GlobeTrotter. All rights reserved.
        </p>
      </div>
    </div>
  </body>
  </html>
  `;
};

/**
 * Send OTP using Brevo REST API (preferred, fast, runs over HTTPS)
 */
const sendViaBrevoApi = async (toEmail, otpCode, apiKey) => {
  const senderEmail = process.env.BREVO_SENDER_EMAIL || 'no-reply@globetrotter.com';
  const senderName = process.env.BREVO_SENDER_NAME || 'GlobeTrotter';

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: senderName, email: senderEmail },
      to: [{ email: toEmail }],
      subject: 'Your Password Reset OTP - GlobeTrotter',
      htmlContent: getOtpEmailHtml(otpCode),
      textContent: `Your GlobeTrotter password reset OTP is: ${otpCode}. It will expire in 10 minutes.`
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Brevo API error (${response.status})`);
  }

  const data = await response.json();
  console.log(`[Brevo API] OTP email successfully sent to ${toEmail}. Message ID: ${data.messageId}`);
  return true;
};

/**
 * Send OTP using Brevo SMTP Relay via Nodemailer
 */
const sendViaBrevoSmtp = async (toEmail, otpCode) => {
  const senderEmail = process.env.BREVO_SENDER_EMAIL || process.env.BREVO_SMTP_USER || 'no-reply@globetrotter.com';
  const senderName = process.env.BREVO_SENDER_NAME || 'GlobeTrotter';

  const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.BREVO_SMTP_USER,
      pass: process.env.BREVO_SMTP_KEY,
    },
  });

  const mailOptions = {
    from: `"${senderName}" <${senderEmail}>`,
    to: toEmail,
    subject: 'Your Password Reset OTP - GlobeTrotter',
    text: `Your GlobeTrotter password reset OTP is: ${otpCode}. It will expire in 10 minutes.`,
    html: getOtpEmailHtml(otpCode),
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`[Brevo SMTP] OTP email sent to ${toEmail}. Response: ${info.response}`);
  return true;
};

/**
 * Main dispatch function for OTP Emails
 */
export const sendOTP = async (toEmail, otpCode) => {
  const apiKey = process.env.BREVO_API_KEY;
  const smtpUser = process.env.BREVO_SMTP_USER;
  const smtpKey = process.env.BREVO_SMTP_KEY;

  // 1. Try Brevo REST API first if API key is provided
  if (apiKey && apiKey.trim().length > 0) {
    try {
      return await sendViaBrevoApi(toEmail, otpCode, apiKey.trim());
    } catch (error) {
      console.error('Brevo API sending failed:', error.message);
    }
  }

  // 2. Try Brevo SMTP if SMTP credentials are provided
  if (smtpUser && smtpKey && smtpKey.trim().length > 0) {
    try {
      return await sendViaBrevoSmtp(toEmail, otpCode);
    } catch (error) {
      console.error('Brevo SMTP sending failed:', error.message);
    }
  }

  // 3. Fallback: Local dev log
  console.log('\n========================================');
  console.log(`🔐 [LOCAL DEV OTP FALLBACK] for ${toEmail}:`);
  console.log(`👉 OTP CODE: ${otpCode}`);
  console.log('========================================\n');
  return true;
};

