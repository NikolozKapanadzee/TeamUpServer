import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { IsAuthGuard } from './guards/isAuth.guard';
import { UserId } from 'src/users/decorators/user.decorator';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { ConfirmPasswordResetDto } from './dto/confirm-password-reset.dto';
import { VerifyEmailDTO } from './dto/verify-email.dto';
import { ResendOTPDto } from './dto/resend-otp.dto';
import { GoogleAuth } from './guards/google.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }
  @Get('google')
  @UseGuards(GoogleAuth)
  continueWithGoogle() {}

  @Get('google/callback')
  @UseGuards(GoogleAuth)
  async googleCallBack(@Req() req, @Res() res: Response) {
    console.log('req.user:', req.user);
    try {
      const { redirectUrl, token } = await this.authService.continueWithGoogle(
        req.user,
      );
      console.log('token:', token);
      const redirectWithToken = `${redirectUrl}?token=${token}`;
      res.redirect(redirectWithToken);
    } catch (error) {
      console.error('OAuth callback error:', error);
    }
  }
  @Post('verify-email')
  verifyEmail(@Body() { email, otpCode }: VerifyEmailDTO) {
    return this.authService.verifyEmail({ email, otpCode });
  }
  @Post('resend-verification-code')
  resendOTPCode(@Body() { email }: ResendOTPDto) {
    return this.authService.resendOTPCode({ email });
  }
  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }
  @Get('current-user')
  @UseGuards(IsAuthGuard)
  getCurrentUser(@UserId() userId: string) {
    return this.authService.getCurrentUser(userId);
  }
  @Post('request-password-reset')
  requestPasswordReset(
    @Body() requestPasswordResetDto: RequestPasswordResetDto,
  ) {
    return this.authService.requestPasswordReset(requestPasswordResetDto);
  }
  @Post('confirm-password-reset')
  confirmPasswordReset(
    @Body() confirmPasswordResetDto: ConfirmPasswordResetDto,
  ) {
    return this.authService.confirmPasswordReset(confirmPasswordResetDto);
  }
}
