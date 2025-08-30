import nodemailer from 'nodemailer';
import { EmailTemplate } from './email-templates';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Email configuration - should be set via environment variables
    const config: EmailConfig = {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      },
    };

    this.transporter = nodemailer.createTransporter(config);
  }

  async sendEmail(to: string, template: EmailTemplate): Promise<boolean> {
    try {
      // Verify transporter configuration
      await this.transporter.verify();

      const mailOptions = {
        from: {
          name: 'PPDB Pondok Pesantren Imam Syafi\'i',
          address: process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@ponpesimamsyafii.id'
        },
        to: to,
        subject: template.subject,
        text: template.text,
        html: template.html,
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      console.log('Email sent successfully:', result.messageId);
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }

  async sendRegistrationConfirmation(
    email: string,
    data: {
      fullName: string;
      registrationNo: string;
      level: string;
      registrationFee: number;
    }
  ): Promise<boolean> {
    const { createRegistrationConfirmationEmail } = await import('./email-templates');
    const template = createRegistrationConfirmationEmail(data);
    return this.sendEmail(email, template);
  }

  async sendStatusUpdate(
    email: string,
    data: {
      fullName: string;
      registrationNo: string;
      status: string;
      statusDescription: string;
      message?: string;
      testSchedule?: string;
      testVenue?: string;
      testResult?: string;
    }
  ): Promise<boolean> {
    const { createStatusUpdateEmail } = await import('./email-templates');
    const template = createStatusUpdateEmail(data);
    return this.sendEmail(email, template);
  }

  async sendBulkEmail(recipients: string[], template: EmailTemplate): Promise<{
    success: number;
    failed: number;
  }> {
    const results = await Promise.allSettled(
      recipients.map(email => this.sendEmail(email, template))
    );

    const success = results.filter(result => result.status === 'fulfilled' && result.value).length;
    const failed = results.length - success;

    return { success, failed };
  }

  // Helper method to test email configuration
  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('Email service is ready');
      return true;
    } catch (error) {
      console.error('Email service configuration error:', error);
      return false;
    }
  }
}

// Singleton instance
let emailService: EmailService | null = null;

export const getEmailService = (): EmailService => {
  if (!emailService) {
    emailService = new EmailService();
  }
  return emailService;
};

export default EmailService;