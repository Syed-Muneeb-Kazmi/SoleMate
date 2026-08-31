// server/utils/sendEmail.js
const nodemailer = require('nodemailer');
const dns = require('dns');

// Force Node.js DNS to prefer IPv4 (fixes ENETUNREACH IPv6 errors on Railway/cloud platforms)
try {
  dns.setDefaultResultOrder('ipv4first');
} catch (e) {
  // Fallback for older Node versions
}

const ipv4Lookup = (hostname, options, callback) => {
  return dns.lookup(hostname, { ...options, family: 4 }, callback);
};

const sendEmail = async ({ to, subject, html }) => {
  const emailUser = process.env.SMTP_USER || process.env.EMAIL_USER;
  const rawPass = process.env.SMTP_PASS || process.env.EMAIL_PASS || '';
  const emailPass = rawPass.replace(/\s+/g, ''); // Strip spaces from App Passwords

  if (!emailUser || !emailPass) {
    throw new Error(
      'Email configuration missing: EMAIL_USER and EMAIL_PASS environment variables must be set on the server.'
    );
  }

  let transporter;

  if (process.env.SMTP_HOST) {
    // Custom SMTP setup (e.g. SendGrid, Brevo, AWS SES, Mailgun)
    const isSecure = process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465';
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10) || (isSecure ? 465 : 587),
      secure: isSecure,
      lookup: ipv4Lookup,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 20000,
    });
  } else {
    // Gmail Transport over SSL port 465 (IPv4 forced via lookup)
    transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      lookup: ipv4Lookup,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 20000,
    });
  }

  const fromAddress = process.env.EMAIL_FROM || `"SoleMate" <${emailUser}>`;

  const info = await transporter.sendMail({
    from: fromAddress,
    to,
    subject,
    html,
  });

  return info;
};

module.exports = sendEmail;