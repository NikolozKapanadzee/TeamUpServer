import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendHtmlToSomeone(to: string, subject: string, html: string) {
    await this.mailerService.sendMail({
      to,
      from: 'TeamUp <teamupts@gmail.com>',
      subject,
      html,
    });
  }
  async sendPasswordResetEmail(to: string, resetToken: string) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>You have requested to reset your password. Click the button below to reset it:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        
        <p style="color: #666;">If you can't click the button, copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #007bff;">${resetUrl}</p>
        
        <p style="color: #666; font-size: 14px;">
          This link will expire in 1 hour. If you didn't request this reset, please ignore this email.
        </p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #999; font-size: 12px;">TeamUp</p>
      </div>
    `;
    await this.sendHtmlToSomeone(to, 'Password Reset Request', html);
  }

  async sendOtpCodeToClient(to: string, otpCode: string) {
    const subject = 'OTP Code';
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>OTP Verification</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #ffffff;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; padding: 40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
              <tr>
                <td style="background-color: #5353C6; color: white; padding: 20px; text-align: center; font-size: 24px; font-weight: bold;">
                  Your OTP Code
                </td>
              </tr>
              <tr>
                <td style="padding: 30px; color: #333333; background-color: #ffffff; text-align: center;">
                  <p style="font-size: 16px; margin-bottom: 20px;">
                    Please use the following OTP code to continue:
                  </p>
                  <p style="font-size: 32px; font-weight: bold; color: #5353C6; margin: 0;">
                    ${otpCode}
                  </p>
                  <p style="font-size: 14px; margin-top: 25px; color: #555555;">
                    This code is valid for <strong>3 minutes</strong>. Do not share it with anyone.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #888888;">
                  If you didn’t request this code, please ignore this email.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
    await this.sendHtmlToSomeone(to, subject, html);
  }
}
