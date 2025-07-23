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
      html: `
     
      <!DOCTYPE html>
<html lang="ka">
  <head>
    <meta charset="UTF-8" />
    <title>საუკეთესო მამა</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Arial', sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 0; background-color: #f5f5f5;">
      <tr>
        <td align="center">
          <table width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
            <tr>
              <td style="background-color: #5250b2; padding: 30px; text-align: center;">
                <h1 style="color: #ffffff; font-size: 28px; margin: 0;">ლადო, საუკეთესო მამა</h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 30px; text-align: center;">
                <p style="font-size: 16px; color: #555555; margin-bottom: 30px;">
                  მადლობა, რომ არსებობ, გვენატრები და გვიყვარხარ!
                </p>
                <a href="#" style="background-color: #5250b2; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 16px;">
                  გულით შენთან ვართ
                </a>
              </td>
            </tr>
            <tr>
              <td style="background-color: #f0f0f0; text-align: center; padding: 20px; font-size: 12px; color: #999999;">
                ამ წერილს გიგზავნიან ისინი, ვინც ყველაზე მეტად გაფასებს. 💜
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>


      `,
    });
  }
}
