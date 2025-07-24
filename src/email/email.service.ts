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
      html: ``,
    });
  }
}
