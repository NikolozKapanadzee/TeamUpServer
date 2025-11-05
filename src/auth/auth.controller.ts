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
import { ApiBadRequestResponse, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiResponse({
    status: 201,
    schema: {
      example: 'check email for verification',
    },
  })
  @ApiBadRequestResponse({
    schema: {
      example: 'user already exists',
    },
  })
  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }
  @Get('google')
  @UseGuards(GoogleAuth)
  continueWithGoogle() {}

  @Get('google/callback')
  @UseGuards(GoogleAuth)
  async googleCallback(@Req() req, @Res() res: Response) {
    const { token } = await this.authService.continueWithGoogle(req.user);

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 60 * 60 * 1000,
      path: '/',
    });

    return res.redirect(`${process.env.FRONTEND_URL}?token=${token}`);
  }

  @ApiResponse({
    status: 201,
    schema: {
      example: 'ok',
    },
  })
  @ApiBadRequestResponse({
    content: {
      'application/json': {
        examples: {
          userNotFound: {
            summary: 'User not found',
            value: {
              statusCode: 400,
              message: 'user not found',
              error: 'Bad Request',
            },
          },
          userAlreadyVerified: {
            summary: 'User is already verified',
            value: {
              statusCode: 400,
              message: 'user is already verified',
              error: 'Bad Request',
            },
          },
          invalidOtp: {
            summary: 'Invalid OTP code',
            value: {
              statusCode: 400,
              message: 'invalid otp code provided',
              error: 'Bad Request',
            },
          },
          otpExpired: {
            summary: 'OTP expired',
            value: {
              statusCode: 400,
              message: 'OTP code expired',
              error: 'Bad Request',
            },
          },
        },
      },
    },
  })
  @Post('verify-email')
  verifyEmail(@Body() { email, otpCode }: VerifyEmailDTO) {
    return this.authService.verifyEmail({ email, otpCode });
  }
  @ApiResponse({
    status: 201,
    schema: {
      example: 'ok',
    },
  })
  @ApiBadRequestResponse({
    schema: {
      example: 'user not found',
    },
  })
  @Post('resend-verification-code')
  resendOTPCode(@Body() { email }: ResendOTPDto) {
    return this.authService.resendOTPCode({ email });
  }
  @ApiResponse({
    status: 201,
    schema: {
      example: 'ok',
    },
  })
  @ApiBadRequestResponse({
    content: {
      'application/json': {
        examples: {
          userNotFound: {
            summary: 'User not found',
            value: {
              statusCode: 400,
              message: 'Invalid credentials',
              error: 'Bad Request',
            },
          },
          userRegisteredViaGoogle: {
            summary: 'User Registered Via Google',
            value: {
              statusCode: 400,
              message:
                'Account registered via Google. Please sign in with Google.',
              error: 'Bad Request',
            },
          },
          passDoesNotMatch: {
            summary: 'Password Does Not Match',
            value: {
              statusCode: 400,
              message: 'Invalid credentials',
              error: 'Bad Request',
            },
          },
          userIsNotVerified: {
            summary: 'User Is Not Verified',
            value: {
              statusCode: 400,
              message: 'you have to verify first',
              error: 'Bad Request',
            },
          },
        },
      },
    },
  })
  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }
  @Get('current-user')
  @UseGuards(IsAuthGuard)
  getCurrentUser(@UserId() userId: string) {
    return this.authService.getCurrentUser(userId);
  }
  @ApiResponse({
    status: 201,
    schema: {
      example: 'If the email exists, a password reset link has been sent',
    },
  })
  @ApiBadRequestResponse({
    schema: {
      example: 'Failed to send reset email. Please try again.',
    },
  })
  @Post('request-password-reset')
  requestPasswordReset(
    @Body() requestPasswordResetDto: RequestPasswordResetDto,
  ) {
    return this.authService.requestPasswordReset(requestPasswordResetDto);
  }
  @ApiResponse({
    status: 201,
    schema: {
      example: 'Password has been reset successfully',
    },
  })
  @ApiBadRequestResponse({
    content: {
      'application/json': {
        examples: {
          invalidTokenFormat: {
            summary: 'Invalid Token Format',
            value: {
              statusCode: 400,
              message: 'Invalid token format',
              error: 'Bad Request',
            },
          },
          userDoesNotExist: {
            summary: 'User Does Not Exist',
            value: {
              statusCode: 400,
              message: 'Invalid or expired reset token',
              error: 'Bad Request',
            },
          },
        },
      },
    },
  })
  @Post('confirm-password-reset')
  confirmPasswordReset(
    @Body() confirmPasswordResetDto: ConfirmPasswordResetDto,
  ) {
    return this.authService.confirmPasswordReset(confirmPasswordResetDto);
  }
}
