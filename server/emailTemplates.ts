/**
 * PrayerCloud Branded Responsive Email Templates
 * 
 * Supports:
 * - HTML with inline CSS (compatible with Outlook, Gmail, Apple Mail, Yahoo)
 * - Plain text alternative for accessibility and spam score optimization
 * - PrayerCloud visual identity: Deep Navy (#0b132b, #1c2541), Spiritual Gold (#f59e0b), Royal Sky (#2563eb)
 */

interface BaseEmailOptions {
  preheader?: string;
  title: string;
  bodyHtml: string;
  actionButton?: {
    text: string;
    url: string;
  };
  footerNote?: string;
}

/**
 * Base wrapper for all PrayerCloud transactional emails
 */
export function wrapInBaseTemplate(options: BaseEmailOptions): string {
  const { preheader = '', title, bodyHtml, actionButton, footerNote } = options;
  const currentYear = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0b132b;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #e2e8f0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #0b132b;
      padding: 30px 15px;
    }
    .container {
      max-width: 580px;
      margin: 0 auto;
      background-color: #111a33;
      border: 1px solid #1e293b;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
    }
    .header {
      background: linear-gradient(135deg, #0d1b3e 0%, #1e293b 100%);
      padding: 32px 24px;
      text-align: center;
      border-bottom: 1px solid #233554;
    }
    .logo-badge {
      display: inline-block;
      padding: 10px 18px;
      background: rgba(37, 99, 235, 0.15);
      border: 1px solid rgba(245, 158, 11, 0.3);
      border-radius: 12px;
      margin-bottom: 12px;
    }
    .logo-text {
      font-size: 24px;
      font-weight: 900;
      letter-spacing: 2px;
      color: #ffffff;
      text-transform: uppercase;
      margin: 0;
    }
    .logo-gold {
      color: #f59e0b;
    }
    .tagline {
      font-size: 11px;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-top: 6px;
    }
    .content {
      padding: 32px 28px;
      line-height: 1.65;
      font-size: 14px;
      color: #cbd5e1;
    }
    h1 {
      font-size: 20px;
      font-weight: 700;
      color: #ffffff;
      margin-top: 0;
      margin-bottom: 16px;
    }
    p {
      margin-top: 0;
      margin-bottom: 16px;
    }
    .otp-box {
      background: #0d1527;
      border: 2px dashed #f59e0b;
      border-radius: 12px;
      padding: 24px;
      text-align: center;
      margin: 24px 0;
    }
    .otp-code {
      font-family: 'Courier New', Courier, monospace;
      font-size: 34px;
      font-weight: 800;
      letter-spacing: 8px;
      color: #f59e0b;
      margin: 0;
    }
    .otp-label {
      font-size: 11px;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: 8px;
    }
    .btn {
      display: inline-block;
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      color: #ffffff !important;
      text-decoration: none;
      font-weight: 700;
      font-size: 14px;
      padding: 14px 28px;
      border-radius: 10px;
      text-align: center;
      box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4);
      margin: 16px 0;
    }
    .scripture-box {
      background: rgba(30, 41, 59, 0.5);
      border-left: 3px solid #f59e0b;
      padding: 14px 18px;
      margin: 24px 0 16px 0;
      border-radius: 0 8px 8px 0;
      font-style: italic;
      color: #93c5fd;
      font-size: 13px;
    }
    .info-card {
      background: #0d1527;
      border: 1px solid #1e293b;
      border-radius: 10px;
      padding: 16px;
      margin: 18px 0;
    }
    .footer {
      background-color: #0d1527;
      border-top: 1px solid #1e293b;
      padding: 24px;
      text-align: center;
      font-size: 11px;
      color: #64748b;
      line-height: 1.5;
    }
    .footer a {
      color: #60a5fa;
      text-decoration: none;
    }
    .preheader {
      display: none !important;
      visibility: hidden;
      mso-hide: all;
      font-size: 1px;
      line-height: 1px;
      max-height: 0;
      max-width: 0;
      opacity: 0;
      overflow: hidden;
    }
  </style>
</head>
<body>
  ${preheader ? `<span class="preheader">${preheader}</span>` : ''}
  <div class="wrapper">
    <div class="container">
      
      <!-- Brand Header -->
      <div class="header">
        <div class="logo-badge">
          <p class="logo-text">PRAYER<span class="logo-gold">CLOUD</span></p>
        </div>
        <div class="tagline">Global Christian Coordination Network &middot; 195 Nations</div>
      </div>

      <!-- Main Body -->
      <div class="content">
        ${bodyHtml}

        ${actionButton ? `
          <div style="text-align: center; margin: 24px 0;">
            <a href="${actionButton.url}" class="btn" target="_blank">${actionButton.text}</a>
          </div>
        ` : ''}

        ${footerNote ? `
          <p style="font-size: 12px; color: #94a3b8; margin-top: 24px; border-top: 1px solid #1e293b; pt: 16px;">
            ${footerNote}
          </p>
        ` : ''}

        <div class="scripture-box">
          &ldquo;And this gospel of the kingdom will be preached in the whole world as a testimony to all nations, and then the end will come.&rdquo;
          <br><strong style="font-style: normal; color: #f59e0b;">— Matthew 24:14</strong>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p style="margin: 0 0 8px 0; color: #94a3b8;">
          Sent by <strong>PrayerCloud Global Missions</strong> &middot; <a href="https://www.livingtech.name.ng">www.livingtech.name.ng</a>
        </p>
        <p style="margin: 0 0 8px 0;">
          This is an automated operational notification. Please do not reply directly to this address.
        </p>
        <p style="margin: 0;">
          &copy; ${currentYear} PrayerCloud. Dedicated to the Great Commission and unreached frontiers.
        </p>
      </div>

    </div>
  </div>
</body>
</html>`;
}

// =========================================================================
// 1. EMAIL OTP (Account Verification, Login Challenge, Password Reset)
// =========================================================================
export function getOtpEmailTemplate(params: {
  otp: string;
  purpose: 'VERIFY_EMAIL' | 'LOGIN_VERIFICATION' | 'PASSWORD_RESET';
  email: string;
  expiryMinutes?: number;
}): { html: string; text: string; subject: string } {
  const { otp, purpose, email, expiryMinutes = 10 } = params;

  let title = 'Verify Your Email Address';
  let subject = `Your PrayerCloud Verification Code: ${otp}`;
  let purposeDescription = 'Please use the 6-digit one-time passcode below to verify your PrayerCloud account and activate your missional access.';

  if (purpose === 'LOGIN_VERIFICATION') {
    title = 'Confirm Your PrayerCloud Sign-In';
    subject = `Your PrayerCloud Security Code: ${otp}`;
    purposeDescription = 'A sign-in attempt was detected for your account. Please enter the security code below to complete authentication.';
  } else if (purpose === 'PASSWORD_RESET') {
    title = 'Password Reset Security Code';
    subject = `Your PrayerCloud Password Reset Code: ${otp}`;
    purposeDescription = 'We received a request to reset the password for your PrayerCloud account. Enter this one-time passcode to proceed.';
  }

  const bodyHtml = `
    <h1>${title}</h1>
    <p>Dear Intercessor,</p>
    <p>${purposeDescription}</p>

    <div class="otp-box">
      <div class="otp-code">${otp}</div>
      <div class="otp-label">Expires in ${expiryMinutes} minutes &middot; Single use only</div>
    </div>

    <div class="info-card">
      <p style="margin: 0 0 6px 0; font-size: 12px; color: #94a3b8;"><strong>Security Notice:</strong></p>
      <ul style="margin: 0; padding-left: 18px; font-size: 12px; color: #cbd5e1;">
        <li>This code was requested for <strong>${email}</strong>.</li>
        <li>Never share this code with anyone. PrayerCloud leaders will never ask for your code.</li>
        <li>If you did not request this verification, your account remains secure; please disregard this email.</li>
      </ul>
    </div>
  `;

  const html = wrapInBaseTemplate({
    preheader: `Your one-time code is ${otp}. Valid for ${expiryMinutes} minutes.`,
    title,
    bodyHtml,
    footerNote: `Verification attempted from PrayerCloud Core API.`
  });

  const text = `PRAYERCLOUD - ${title}
----------------------------------------

Dear Intercessor,

${purposeDescription}

YOUR ONE-TIME CODE: ${otp}

* This code expires in ${expiryMinutes} minutes.
* Single-use only.
* Never share this code with anyone.

If you did not request this code for ${email}, you can safely disregard this message.

"And this gospel of the kingdom will be preached in the whole world as a testimony to all nations, and then the end will come." — Matthew 24:14

PrayerCloud Global Missions
https://www.livingtech.name.ng`;

  return { html, text, subject };
}

// =========================================================================
// 2. WELCOME EMAIL (After Successful Registration)
// =========================================================================
export function getWelcomeEmailTemplate(params: {
  fullName: string;
  email: string;
  role: string;
  appUrl: string;
}): { html: string; text: string; subject: string } {
  const { fullName, email, role, appUrl } = params;
  const subject = `Welcome to PrayerCloud, ${fullName}! 🌍`;

  const bodyHtml = `
    <h1>Welcome to the Global Watch, ${fullName}!</h1>
    <p>
      Grace and peace to you in the name of our Lord Jesus Christ. Your PrayerCloud account has been successfully verified and is now fully active.
    </p>

    <div class="info-card">
      <p style="margin: 0 0 8px 0; font-weight: 700; color: #f59e0b;">Your Missional Profile:</p>
      <table style="width: 100%; font-size: 13px; color: #cbd5e1;">
        <tr><td style="padding: 3px 0; color: #94a3b8;">Full Name:</td><td><strong>${fullName}</strong></td></tr>
        <tr><td style="padding: 3px 0; color: #94a3b8;">Email Address:</td><td>${email}</td></tr>
        <tr><td style="padding: 3px 0; color: #94a3b8;">Assigned Role:</td><td><span style="color: #60a5fa; font-weight: 700;">${role}</span></td></tr>
        <tr><td style="padding: 3px 0; color: #94a3b8;">Status:</td><td><span style="color: #10b981; font-weight: 700;">&#10003; Verified</span></td></tr>
      </table>
    </div>

    <p>Here is how you can begin coordinating with the worldwide body of Christ today:</p>
    <ul style="padding-left: 20px; margin-bottom: 20px;">
      <li style="margin-bottom: 8px;"><strong>195 Nations Directory:</strong> Discover demographic census data and unreached people groups across all frontiers.</li>
      <li style="margin-bottom: 8px;"><strong>Global Prayer Wall:</strong> Post prayer petitions and stand in the gap with thousands of intercessors.</li>
      <li style="margin-bottom: 8px;"><strong>Frontier Summits:</strong> Attend live prayer conferences and missionary strategy roundtables.</li>
      <li style="margin-bottom: 8px;"><strong>Interactive World Map:</strong> Visualize unreached sectors and monitor ongoing spiritual alerts.</li>
    </ul>
  `;

  const html = wrapInBaseTemplate({
    preheader: `Welcome to PrayerCloud! Your account is active as ${role}.`,
    title: `Welcome to PrayerCloud`,
    bodyHtml,
    actionButton: {
      text: 'Launch PrayerCloud Dashboard',
      url: appUrl
    },
    footerNote: `You are receiving this because you registered at PrayerCloud.`
  });

  const text = `WELCOME TO PRAYERCLOUD, ${fullName}!
----------------------------------------

Grace and peace to you in the name of our Lord Jesus Christ. Your PrayerCloud account has been successfully verified.

Account Details:
- Name: ${fullName}
- Email: ${email}
- Role: ${role}
- Status: Verified

Access the platform at: ${appUrl}

"And this gospel of the kingdom will be preached in the whole world as a testimony to all nations, and then the end will come." — Matthew 24:14

PrayerCloud Global Missions
https://www.livingtech.name.ng`;

  return { html, text, subject };
}

// =========================================================================
// 3. PASSWORD RESET EMAIL (Tokenized Link + Code)
// =========================================================================
export function getPasswordResetEmailTemplate(params: {
  resetUrl: string;
  resetCode: string;
  email: string;
  expiryMinutes?: number;
}): { html: string; text: string; subject: string } {
  const { resetUrl, resetCode, email, expiryMinutes = 30 } = params;
  const subject = `PrayerCloud Password Reset Request`;

  const bodyHtml = `
    <h1>Reset Your Account Password</h1>
    <p>Dear Intercessor,</p>
    <p>
      We received a request to reset the password associated with <strong>${email}</strong>.
      Click the button below or enter the secure code on the reset page to set a new password.
    </p>

    <div class="otp-box">
      <div class="otp-code">${resetCode}</div>
      <div class="otp-label">Single-use reset code &middot; Valid for ${expiryMinutes} minutes</div>
    </div>

    <p style="text-align: center; margin: 16px 0;">
      <a href="${resetUrl}" class="btn" target="_blank">Reset My Password</a>
    </p>

    <div class="info-card">
      <p style="margin: 0 0 6px 0; font-size: 12px; color: #94a3b8;"><strong>Direct Link:</strong></p>
      <p style="margin: 0; font-size: 11px; word-break: break-all; color: #60a5fa;">
        ${resetUrl}
      </p>
    </div>

    <p style="font-size: 12px; color: #94a3b8;">
      If you did not request a password reset, please ignore this email or change your password if you suspect unauthorized access. Your account remains protected.
    </p>
  `;

  const html = wrapInBaseTemplate({
    preheader: `PrayerCloud password reset link and code. Valid for ${expiryMinutes} minutes.`,
    title: 'Reset Your Password',
    bodyHtml,
    footerNote: `This link is single-use and will expire in ${expiryMinutes} minutes.`
  });

  const text = `PRAYERCLOUD - PASSWORD RESET
----------------------------------------

Dear Intercessor,

We received a request to reset your PrayerCloud password.

Direct Reset Link:
${resetUrl}

Alternatively, enter this one-time reset code: ${resetCode}

This link and code expire in ${expiryMinutes} minutes and can only be used once.

If you did not request this reset, your account is still secure and you can safely ignore this message.

PrayerCloud Global Missions
https://www.livingtech.name.ng`;

  return { html, text, subject };
}

// =========================================================================
// 4. ACCOUNT SECURITY ALERTS (New Login, Password Change, Email Change)
// =========================================================================
export function getSecurityAlertEmailTemplate(params: {
  alertType: 'NEW_LOGIN' | 'PASSWORD_CHANGED' | 'EMAIL_CHANGED';
  email: string;
  details: {
    ip?: string;
    userAgent?: string;
    timestamp?: string;
    location?: string;
  };
}): { html: string; text: string; subject: string } {
  const { alertType, email, details } = params;
  const timeStr = details.timestamp || new Date().toUTCString();

  let title = 'Security Alert: Account Activity';
  let subject = 'PrayerCloud Security Alert';
  let explanation = '';

  if (alertType === 'NEW_LOGIN') {
    title = 'New Sign-In Detected';
    subject = 'PrayerCloud: New Sign-In to Your Account';
    explanation = 'A new sign-in was just recorded for your PrayerCloud account.';
  } else if (alertType === 'PASSWORD_CHANGED') {
    title = 'Your Password Was Successfully Changed';
    subject = 'PrayerCloud: Password Change Notification';
    explanation = 'The password for your PrayerCloud account was recently updated.';
  } else if (alertType === 'EMAIL_CHANGED') {
    title = 'Your Account Email Address Was Updated';
    subject = 'PrayerCloud: Email Address Update Notification';
    explanation = 'The primary email address on your PrayerCloud account has been modified.';
  }

  const bodyHtml = `
    <h1>${title}</h1>
    <p>Dear Intercessor,</p>
    <p>${explanation}</p>

    <div class="info-card">
      <table style="width: 100%; font-size: 12px; color: #cbd5e1;">
        <tr><td style="padding: 4px 0; color: #94a3b8; width: 35%;">Account:</td><td>${email}</td></tr>
        <tr><td style="padding: 4px 0; color: #94a3b8;">Timestamp:</td><td>${timeStr}</td></tr>
        ${details.ip ? `<tr><td style="padding: 4px 0; color: #94a3b8;">IP Address:</td><td>${details.ip}</td></tr>` : ''}
        ${details.userAgent ? `<tr><td style="padding: 4px 0; color: #94a3b8;">Client:</td><td>${details.userAgent}</td></tr>` : ''}
      </table>
    </div>

    <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 10px; padding: 16px; margin: 18px 0;">
      <p style="margin: 0; color: #fca5a5; font-size: 12px;">
        <strong>Didn't authorize this action?</strong>
        <br>If this wasn't you, please immediately reset your password and contact support at 
        <a href="mailto:missions@prayercloud.org" style="color: #60a5fa;">missions@prayercloud.org</a> to secure your credentials.
      </p>
    </div>
  `;

  const html = wrapInBaseTemplate({
    preheader: `PrayerCloud Security Alert: ${title} on ${email}`,
    title,
    bodyHtml
  });

  const text = `PRAYERCLOUD SECURITY ALERT - ${title}
----------------------------------------

Dear Intercessor,

${explanation}

Activity Details:
- Account: ${email}
- Timestamp: ${timeStr}
${details.ip ? `- IP Address: ${details.ip}\n` : ''}
${details.userAgent ? `- Client: ${details.userAgent}\n` : ''}

If this was NOT you, please immediately reset your password and contact support at missions@prayercloud.org.

PrayerCloud Global Missions
https://www.livingtech.name.ng`;

  return { html, text, subject };
}

// =========================================================================
// 5. PRAYER PETITION & ANSWER NOTIFICATIONS
// =========================================================================
export function getPrayerNotificationEmailTemplate(params: {
  type: 'AGREED' | 'COMMENTED' | 'ANSWERED';
  prayerTitle: string;
  intercessorName: string;
  commentSnippet?: string;
  targetCountry?: string;
  appUrl: string;
}): { html: string; text: string; subject: string } {
  const { type, prayerTitle, intercessorName, commentSnippet, targetCountry, appUrl } = params;

  let title = 'An Intercessor Has Agreed in Prayer';
  let subject = `An intercessor just agreed with your prayer petition! 🙏`;

  if (type === 'COMMENTED') {
    title = 'New Encouragement on Your Prayer Petition';
    subject = `New prayer encouragement on: "${prayerTitle}"`;
  } else if (type === 'ANSWERED') {
    title = 'Praise Report: Prayer Answered!';
    subject = `Praise the Lord! Prayer Answered: "${prayerTitle}" 🙌`;
  }

  const bodyHtml = `
    <h1>${title}</h1>
    <p>Dear Missionary &amp; Intercessor,</p>
    <p>
      <strong>${intercessorName}</strong> has joined in spiritual agreement regarding your prayer petition on the Global Prayer Wall:
    </p>

    <div class="info-card" style="border-left: 4px solid #2563eb;">
      <p style="margin: 0 0 6px 0; font-size: 15px; font-weight: 700; color: #ffffff;">
        &ldquo;${prayerTitle}&rdquo;
      </p>
      ${targetCountry ? `<p style="margin: 0; font-size: 12px; color: #94a3b8;">Target Field: <strong>${targetCountry}</strong></p>` : ''}
    </div>

    ${commentSnippet ? `
      <div style="background: rgba(37, 99, 235, 0.1); border: 1px solid rgba(37, 99, 235, 0.2); border-radius: 10px; padding: 14px; margin: 16px 0;">
        <p style="margin: 0 0 4px 0; font-size: 11px; text-transform: uppercase; color: #60a5fa; font-weight: 700;">Intercessor's Note:</p>
        <p style="margin: 0; font-style: italic; color: #e2e8f0; font-size: 13px;">&ldquo;${commentSnippet}&rdquo;</p>
      </div>
    ` : ''}

    <p style="font-size: 13px; color: #cbd5e1;">
      The prayer count has updated in real-time on the PrayerCloud Global Wall.
    </p>
  `;

  const html = wrapInBaseTemplate({
    preheader: `${intercessorName} stood in prayer with you: "${prayerTitle}"`,
    title,
    bodyHtml,
    actionButton: {
      text: 'View Prayer Wall',
      url: `${appUrl}/#prayer-board`
    }
  });

  const text = `PRAYERCLOUD - ${title}
----------------------------------------

${intercessorName} has stood in spiritual agreement with your petition:
"${prayerTitle}"

${commentSnippet ? `Note: "${commentSnippet}"\n` : ''}
View the Prayer Wall: ${appUrl}

PrayerCloud Global Missions
https://www.livingtech.name.ng`;

  return { html, text, subject };
}

// =========================================================================
// 6. EVENT RSVP & SUMMIT NOTIFICATIONS
// =========================================================================
export function getEventRsvpEmailTemplate(params: {
  eventTitle: string;
  scheduledAt: string;
  zoomUrl?: string;
  participantName: string;
  appUrl: string;
}): { html: string; text: string; subject: string } {
  const { eventTitle, scheduledAt, zoomUrl, participantName, appUrl } = params;
  const subject = `Confirmed: Your RSVP for "${eventTitle}"`;

  const bodyHtml = `
    <h1>RSVP Confirmed!</h1>
    <p>Dear ${participantName},</p>
    <p>Your seat has been reserved for the upcoming prayer summit:</p>

    <div class="info-card">
      <p style="margin: 0 0 8px 0; font-size: 16px; font-weight: 700; color: #f59e0b;">${eventTitle}</p>
      <p style="margin: 0 0 4px 0; font-size: 13px; color: #cbd5e1;">📅 <strong>Date &amp; Time:</strong> ${scheduledAt}</p>
      ${zoomUrl ? `<p style="margin: 0; font-size: 13px; color: #cbd5e1;">🎥 <strong>Meeting Link:</strong> <a href="${zoomUrl}" style="color: #60a5fa;" target="_blank">Join Video Conference</a></p>` : ''}
    </div>

    <p style="font-size: 13px; color: #cbd5e1;">
      We encourage you to come prepared to intercede for unreached nations, missionary teams, and frontier churches.
    </p>
  `;

  const html = wrapInBaseTemplate({
    preheader: `RSVP Confirmed for ${eventTitle} (${scheduledAt})`,
    title: 'Prayer Summit RSVP Confirmed',
    bodyHtml,
    actionButton: zoomUrl ? {
      text: 'Access Video Conference',
      url: zoomUrl
    } : {
      text: 'View Summit Schedule',
      url: `${appUrl}/#conferences`
    }
  });

  const text = `PRAYERCLOUD - RSVP CONFIRMED
----------------------------------------

Dear ${participantName},

Your RSVP for "${eventTitle}" is confirmed!

Date/Time: ${scheduledAt}
${zoomUrl ? `Meeting Link: ${zoomUrl}\n` : ''}

PrayerCloud Global Missions
https://www.livingtech.name.ng`;

  return { html, text, subject };
}

// =========================================================================
// 7. CONTACT FORM CONFIRMATION (Sender) & ADMIN NOTIFICATION (Receiver)
// =========================================================================
export function getContactConfirmationEmailTemplate(params: {
  name: string;
  subject: string;
  message: string;
}): { html: string; text: string; subject: string } {
  const { name, subject, message } = params;
  const emailSubject = `We Received Your Message: ${subject}`;

  const bodyHtml = `
    <h1>Message Received, ${name}</h1>
    <p>
      Thank you for contacting PrayerCloud Global Missions. We have received your inquiry and our mission coordinators will respond to you promptly.
    </p>

    <div class="info-card">
      <p style="margin: 0 0 6px 0; font-weight: 700; color: #f59e0b;">Summary of Your Inquiry:</p>
      <p style="margin: 0 0 4px 0; font-size: 12px; color: #94a3b8;">Subject: <span style="color: #ffffff;">${subject}</span></p>
      <p style="margin: 8px 0 0 0; font-size: 13px; color: #cbd5e1; font-style: italic; white-space: pre-wrap;">
        &ldquo;${message}&rdquo;
      </p>
    </div>

    <p style="font-size: 13px; color: #94a3b8;">
      If your inquiry is urgent regarding mission mobilization or field support, please reach out to missions@prayercloud.org.
    </p>
  `;

  const html = wrapInBaseTemplate({
    preheader: `Thank you for contacting PrayerCloud. Your inquiry "${subject}" has been received.`,
    title: 'Inquiry Received',
    bodyHtml
  });

  const text = `PRAYERCLOUD - INQUIRY RECEIVED
----------------------------------------

Dear ${name},

Thank you for contacting PrayerCloud Global Missions. We have received your inquiry:

Subject: ${subject}
Message:
${message}

Our team will respond promptly.

PrayerCloud Global Missions
https://www.livingtech.name.ng`;

  return { html, text, subject: emailSubject };
}

export function getContactAdminNotificationEmailTemplate(params: {
  name: string;
  email: string;
  subject: string;
  message: string;
  ip?: string;
}): { html: string; text: string; subject: string } {
  const { name, email, subject, message, ip } = params;
  const emailSubject = `[PrayerCloud Inquiry] ${subject} from ${name}`;

  const bodyHtml = `
    <h1 style="color: #f59e0b;">New Contact Form Submission</h1>
    <p>A user submitted a contact form on PrayerCloud:</p>

    <div class="info-card">
      <table style="width: 100%; font-size: 13px; color: #cbd5e1;">
        <tr><td style="padding: 4px 0; color: #94a3b8; width: 30%;">Sender Name:</td><td><strong>${name}</strong></td></tr>
        <tr><td style="padding: 4px 0; color: #94a3b8;">Sender Email:</td><td><a href="mailto:${email}" style="color: #60a5fa;">${email}</a></td></tr>
        <tr><td style="padding: 4px 0; color: #94a3b8;">Subject:</td><td><strong>${subject}</strong></td></tr>
        ${ip ? `<tr><td style="padding: 4px 0; color: #94a3b8;">IP Address:</td><td>${ip}</td></tr>` : ''}
        <tr><td style="padding: 4px 0; color: #94a3b8;">Timestamp:</td><td>${new Date().toUTCString()}</td></tr>
      </table>
    </div>

    <div style="background: #0d1527; border: 1px solid #233554; border-radius: 10px; padding: 16px; margin: 16px 0;">
      <p style="margin: 0 0 6px 0; font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: 700;">Message Content:</p>
      <div style="font-size: 13px; color: #e2e8f0; white-space: pre-wrap; line-height: 1.6;">${message}</div>
    </div>
  `;

  const html = wrapInBaseTemplate({
    preheader: `New contact submission from ${name} (${email}): ${subject}`,
    title: 'New Contact Form Submission',
    bodyHtml,
    actionButton: {
      text: `Reply to ${email}`,
      url: `mailto:${email}?subject=Re: ${encodeURIComponent(subject)}`
    }
  });

  const text = `NEW CONTACT FORM SUBMISSION
----------------------------------------
From: ${name} (${email})
Subject: ${subject}
Date: ${new Date().toUTCString()}
${ip ? `IP: ${ip}\n` : ''}

Message:
${message}
`;

  return { html, text, subject: emailSubject };
}
