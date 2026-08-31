// server/utils/sendEmail.js
//
// Uses Resend (HTTPS API) when RESEND_API_KEY is set — works on Railway Free.
// Falls back to Nodemailer/SMTP for local development.

const sendEmail = async ({ to, subject, html }) => {
  // ── Resend (production-safe, HTTPS API) ──────────────────────────────────
  if (process.env.RESEND_API_KEY) {
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    const fromAddress =
      process.env.EMAIL_FROM || 'SoleMate <onboarding@resend.dev>';

    console.log(`[sendEmail] Using Resend API to send to ${to}`);

    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to,
      subject,
      html,
    });

    if (error) {
      console.error('[sendEmail] Resend error:', error);
      throw new Error(error.message || 'Resend email failed');
    }

    console.log(`[sendEmail] Email sent via Resend. ID: ${data?.id}`);
    return data;
  }

  // ── Nodemailer fallback (local dev with Gmail SMTP) ──────────────────────
  const dns = require('dns');
  try { dns.setDefaultResultOrder('ipv4first'); } catch (e) {}

  const nodemailer = require('nodemailer');

  const emailUser = process.env.SMTP_USER || process.env.EMAIL_USER;
  const rawPass   = process.env.SMTP_PASS || process.env.EMAIL_PASS || '';
  const emailPass = rawPass.replace(/\s+/g, '');

  if (!emailUser || !emailPass) {
    throw new Error(
      'Email not configured: set RESEND_API_KEY (production) or EMAIL_USER + EMAIL_PASS (local dev).'
    );
  }

  const smtpHost   = process.env.SMTP_HOST   || 'smtp.gmail.com';
  const smtpPort   = parseInt(process.env.SMTP_PORT, 10) || 587;
  const smtpSecure = process.env.SMTP_SECURE === 'true' || smtpPort === 465;

  console.log(`[sendEmail] Using Nodemailer via ${smtpHost}:${smtpPort} to ${to}`);

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: { user: emailUser, pass: emailPass },
    tls: { rejectUnauthorized: false, servername: smtpHost },
    connectionTimeout: 20000,
    greetingTimeout:   20000,
    socketTimeout:     30000,
    family: 4, // Force IPv4
  });

  const fromAddress = process.env.EMAIL_FROM || `"SoleMate" <${emailUser}>`;

  const info = await transporter.sendMail({ from: fromAddress, to, subject, html });
  console.log(`[sendEmail] Email sent via Nodemailer. MessageId: ${info.messageId}`);
  return info;
};

module.exports = sendEmail;