import {
  getOtpEmailTemplate,
  getWelcomeEmailTemplate,
  getPasswordResetEmailTemplate,
  getSecurityAlertEmailTemplate,
  getPrayerNotificationEmailTemplate,
  getEventRsvpEmailTemplate,
  getContactConfirmationEmailTemplate,
  getContactAdminNotificationEmailTemplate,
} from './emailTemplates.ts';

export interface SendEmailPayload {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
  idempotencyKey?: string;
  tags?: Array<{ name: string; value: string }>;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  mode: 'resend' | 'logged_fallback';
}

class EmailService {
  // In-memory idempotency cache (TTL: 1 hour)
  private sentIdempotencyKeys = new Map<string, { timestamp: number; messageId: string }>();

  private getApiKey(): string {
    return (process.env.RESEND_API_KEY || '').trim();
  }

  private getDefaultFrom(): string {
    const raw = (process.env.EMAIL_FROM || '').trim();
    if (!raw) {
      return 'PrayerCloud <notifications@livingtech.name.ng>';
    }
    // If raw contains @, ensure it has a display name
    if (raw.includes('@')) {
      return raw.includes('<') ? raw : `PrayerCloud <${raw}>`;
    }
    // If raw contains livingtech.name.ng, use the verified domain livingtech.name.ng
    if (raw.includes('livingtech.name.ng')) {
      return 'PrayerCloud <notifications@livingtech.name.ng>';
    }
    // If raw is a bare domain, prepend notifications@
    const cleanDomain = raw.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    return `PrayerCloud <notifications@${cleanDomain}>`;
  }

  private getAdminEmail(): string {
    return (
      (process.env.ADMIN_NOTIFICATION_EMAIL || '').trim() ||
      'dtemitope60@gmail.com'
    );
  }

  private getAppUrl(): string {
    return (
      (process.env.APP_URL || '').trim() ||
      'https://www.livingtech.name.ng'
    );
  }

  /**
   * Cleans old idempotency keys older than 1 hour
   */
  private cleanIdempotencyCache() {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    for (const [key, val] of this.sentIdempotencyKeys.entries()) {
      if (val.timestamp < oneHourAgo) {
        this.sentIdempotencyKeys.delete(key);
      }
    }
  }

  /**
   * Core email dispatcher
   * Calls Resend REST API or logs cleanly if no key is configured
   */
  public async sendEmail(payload: SendEmailPayload): Promise<SendEmailResult> {
    const { to, subject, html, text, from = this.getDefaultFrom(), replyTo, idempotencyKey, tags } = payload;
    const recipients = Array.isArray(to) ? to : [to];

    // Check idempotency key to prevent duplicate email dispatches
    if (idempotencyKey) {
      this.cleanIdempotencyCache();
      const existing = this.sentIdempotencyKeys.get(idempotencyKey);
      if (existing) {
        console.log(`[EmailService] Idempotency match for key "${idempotencyKey}". Skipping duplicate send.`);
        return {
          success: true,
          messageId: existing.messageId,
          mode: 'resend',
        };
      }
    }

    const apiKey = this.getApiKey();

    // If Resend API Key is configured, make HTTPS request to Resend API
    if (apiKey) {
      try {
        const bodyPayload: Record<string, any> = {
          from,
          to: recipients,
          subject,
          html,
          text: text || '',
        };

        if (replyTo) {
          bodyPayload.reply_to = replyTo;
        }

        if (tags && tags.length > 0) {
          bodyPayload.tags = tags;
        }

        const headers: Record<string, string> = {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'User-Agent': 'PrayerCloud-EmailEngine/1.0',
        };

        if (idempotencyKey) {
          headers['Idempotency-Key'] = idempotencyKey;
        }

        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers,
          body: JSON.stringify(bodyPayload),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          const errMsg = data?.message || data?.error || `HTTP ${res.status} from Resend`;
          console.error(`[EmailService] Resend API error sending to ${recipients.join(', ')}:`, errMsg);
          return {
            success: false,
            error: errMsg,
            mode: 'resend',
          };
        }

        const messageId = data?.id || `msg-${Date.now()}`;

        if (idempotencyKey) {
          this.sentIdempotencyKeys.set(idempotencyKey, {
            timestamp: Date.now(),
            messageId,
          });
        }

        console.log(`[EmailService] Email dispatched via Resend to ${recipients.join(', ')} (ID: ${messageId})`);

        return {
          success: true,
          messageId,
          mode: 'resend',
        };
      } catch (err: any) {
        console.error('[EmailService] Network exception contacting Resend:', err);
        return {
          success: false,
          error: err?.message || 'Failed to dispatch email via Resend',
          mode: 'resend',
        };
      }
    }

    // Fallback: Resend API Key is not set yet (e.g. pending user Secret Manager injection)
    // Log clearly without breaking application flows
    const mockId = `mock-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    console.log(`=======================================================`);
    console.log(`📬 [EmailService Fallback] To: ${recipients.join(', ')}`);
    console.log(`📌 Subject: ${subject}`);
    console.log(`🕒 Timestamp: ${new Date().toISOString()}`);
    console.log(`ℹ️ RESEND_API_KEY is not configured yet in environment.`);
    console.log(`=======================================================`);

    if (idempotencyKey) {
      this.sentIdempotencyKeys.set(idempotencyKey, {
        timestamp: Date.now(),
        messageId: mockId,
      });
    }

    return {
      success: true,
      messageId: mockId,
      mode: 'logged_fallback',
    };
  }

  // =========================================================================
  // HIGH-LEVEL EMAIL DISPATCH HELPERS
  // =========================================================================

  /**
   * 1. Send OTP for email verification / sign-in challenge
   */
  public async sendVerificationOtp(
    email: string,
    otp: string,
    purpose: 'VERIFY_EMAIL' | 'LOGIN_VERIFICATION' | 'PASSWORD_RESET' = 'VERIFY_EMAIL',
    expiryMinutes = 10
  ): Promise<SendEmailResult> {
    const template = getOtpEmailTemplate({
      otp,
      purpose,
      email,
      expiryMinutes,
    });

    return this.sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
      idempotencyKey: `otp-${email}-${otp}`,
      tags: [{ name: 'category', value: 'otp-verification' }],
    });
  }

  /**
   * 2. Send Welcome email after successful verification & registration
   */
  public async sendWelcomeEmail(fullName: string, email: string, role = 'Prayer Warrior'): Promise<SendEmailResult> {
    const template = getWelcomeEmailTemplate({
      fullName,
      email,
      role,
      appUrl: this.getAppUrl(),
    });

    return this.sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
      idempotencyKey: `welcome-${email}`,
      tags: [{ name: 'category', value: 'welcome-onboarding' }],
    });
  }

  /**
   * 3. Send Password Reset Link & Code
   */
  public async sendPasswordResetEmail(
    email: string,
    resetToken: string,
    resetCode: string,
    expiryMinutes = 30
  ): Promise<SendEmailResult> {
    const appUrl = this.getAppUrl();
    const resetUrl = `${appUrl}/?reset_token=${resetToken}&email=${encodeURIComponent(email)}#reset-password`;

    const template = getPasswordResetEmailTemplate({
      resetUrl,
      resetCode,
      email,
      expiryMinutes,
    });

    return this.sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
      idempotencyKey: `pwd-reset-${resetToken}`,
      tags: [{ name: 'category', value: 'password-reset' }],
    });
  }

  /**
   * 4. Send Security Alerts (Login, Password Change, Email Change)
   */
  public async sendSecurityAlert(
    email: string,
    alertType: 'NEW_LOGIN' | 'PASSWORD_CHANGED' | 'EMAIL_CHANGED',
    details: { ip?: string; userAgent?: string; timestamp?: string }
  ): Promise<SendEmailResult> {
    const template = getSecurityAlertEmailTemplate({
      alertType,
      email,
      details,
    });

    return this.sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
      tags: [{ name: 'category', value: 'security-alert' }],
    });
  }

  /**
   * 5. Send Prayer Petition Agreed notification
   */
  public async sendPrayerAgreedNotification(
    authorEmail: string,
    prayerTitle: string,
    intercessorName: string,
    targetCountry?: string
  ): Promise<SendEmailResult> {
    const template = getPrayerNotificationEmailTemplate({
      type: 'AGREED',
      prayerTitle,
      intercessorName,
      targetCountry,
      appUrl: this.getAppUrl(),
    });

    return this.sendEmail({
      to: authorEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
      tags: [{ name: 'category', value: 'prayer-notification' }],
    });
  }

  /**
   * 6. Send Prayer Petition Answered praise report
   */
  public async sendPrayerAnsweredNotification(
    recipientEmails: string[],
    prayerTitle: string,
    authorName: string
  ): Promise<SendEmailResult> {
    if (!recipientEmails.length) return { success: true, mode: 'logged_fallback' };

    const template = getPrayerNotificationEmailTemplate({
      type: 'ANSWERED',
      prayerTitle,
      intercessorName: authorName,
      appUrl: this.getAppUrl(),
    });

    return this.sendEmail({
      to: recipientEmails,
      subject: template.subject,
      html: template.html,
      text: template.text,
      tags: [{ name: 'category', value: 'prayer-answered' }],
    });
  }

  /**
   * 7. Send Event RSVP confirmation
   */
  public async sendEventRsvpEmail(
    email: string,
    participantName: string,
    eventTitle: string,
    scheduledAt: string,
    zoomUrl?: string
  ): Promise<SendEmailResult> {
    const template = getEventRsvpEmailTemplate({
      eventTitle,
      scheduledAt,
      zoomUrl,
      participantName,
      appUrl: this.getAppUrl(),
    });

    return this.sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
      idempotencyKey: `rsvp-${email}-${eventTitle}-${scheduledAt}`,
      tags: [{ name: 'category', value: 'event-rsvp' }],
    });
  }

  /**
   * 8. Send Contact Form confirmation to sender and alert to admin
   */
  public async handleContactSubmission(
    name: string,
    email: string,
    subject: string,
    message: string,
    ip?: string
  ): Promise<{ senderResult: SendEmailResult; adminResult: SendEmailResult }> {
    // 1. Send confirmation to the person submitting the inquiry
    const senderTemplate = getContactConfirmationEmailTemplate({
      name,
      subject,
      message,
    });

    const senderResult = await this.sendEmail({
      to: email,
      subject: senderTemplate.subject,
      html: senderTemplate.html,
      text: senderTemplate.text,
      replyTo: this.getAdminEmail(),
      tags: [{ name: 'category', value: 'contact-confirmation' }],
    });

    // 2. Send notification to administrator
    const adminTemplate = getContactAdminNotificationEmailTemplate({
      name,
      email,
      subject,
      message,
      ip,
    });

    const adminResult = await this.sendEmail({
      to: this.getAdminEmail(),
      subject: adminTemplate.subject,
      html: adminTemplate.html,
      text: adminTemplate.text,
      replyTo: email,
      tags: [{ name: 'category', value: 'contact-admin-alert' }],
    });

    return { senderResult, adminResult };
  }
}

export const emailService = new EmailService();
