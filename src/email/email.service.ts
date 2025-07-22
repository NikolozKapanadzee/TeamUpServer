import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}
  async sendHtmlToSomeone(to, subject) {
    const options = {
      to,
      from: 'TeamUp <teamupts@gmail.com>',
      subject: 'Recover Password',
      html: `
      <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Password Recovery</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
            <tr>
              <td align="center" style="padding-bottom: 20px;">
                <h2 style="margin: 0; color: #333;">Reset Your Password</h2>
              </td>
            </tr>
            <tr>
              <td style="color: #555; font-size: 16px; padding-bottom: 20px;">
                Hi there,<br /><br />
                We received a request to reset your password. Click the button below to choose a new one.
              </td>
            </tr>
            <tr>
              <td align="center" style="padding-bottom: 30px;">
                <a href="https://yourdomain.com/reset-password?token=123456" style="background-color: #61A6FA; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                  Reset Password
                </a>
              </td>
            </tr>
            <tr>
              <td style="color: #999; font-size: 14px; line-height: 1.5;">
                If you didn’t request a password reset, please ignore this email or contact support if you have questions.
                <br /><br />
                This password reset link will expire in 60 minutes.
              </td>
            </tr>
            <tr>
              <td style="padding-top: 30px; color: #aaa; font-size: 12px; text-align: center;">
                &copy; 2025 TeamUp. All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>

      
      `,
    };
    await this.mailerService.sendMail(options);
  }
}
