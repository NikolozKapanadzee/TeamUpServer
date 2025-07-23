import { Injectable } from '@nestjs/common';
import { EmailService } from './email/email.service';

@Injectable()
export class AppService {
  constructor(private emailService: EmailService) {}
  getHello(): string {
    return 'This Is TeamUp!';
  }

  // async sendEmail(to: string, subject: string, html: string) {
  //   await this.emailService.sendHtmlToSomeone(to, subject, html);
  //   console.log('Email sent successfully');
  // }
}
