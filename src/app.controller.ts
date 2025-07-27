import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // @Post('/send-email')
  // sendEmail(@Body() body: { to: string; subject: string; html: string }) {
  //   const { to, subject, html } = body;
  //   return this.appService.sendEmail(to, subject, html);
  // }
}
