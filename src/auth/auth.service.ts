import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/schema/users.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { ConfirmPasswordResetDto } from './dto/confirm-password-reset.dto';
import { EmailService } from 'src/email/email.service';
import { VerifyEmailDTO } from './dto/verify-email.dto';
import { ResendOTPDto } from './dto/resend-otp.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async signUp({ email, password }: SignUpDto) {
    const existUser = await this.userModel.findOne({ email });
    if (existUser) {
      throw new BadRequestException('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const otpCode = Math.random().toString().slice(2, 8);
    const validationDate = new Date();
    validationDate.setTime(validationDate.getTime() + 3 * 60 * 1000);
    const newUser = await this.userModel.create({
      email,
      password: hashedPassword,
      OTPCode: otpCode,
      OTPValidationDate: validationDate,
    });

    await this.emailService.sendOtpCodeToClient(email, otpCode);
    return { message: 'check email for continue verification' };
  }

  async verifyEmail({ email, otpCode }: VerifyEmailDTO) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new BadRequestException('user not found');
    if (user.verified)
      throw new BadRequestException('user is already verified');
    if (new Date(user.OTPValidationDate as string) < new Date()) {
      throw new BadRequestException('OTP code expired');
    }
    if (user.OTPCode !== otpCode)
      throw new BadRequestException('invalid otp code provided');

    await this.userModel.updateOne(
      { _id: user._id },
      {
        $set: { OTPCode: null, OTPValidationDate: null, verified: true },
      },
    );
    // const payload = {
    //   id: user._id,
    // };
    // const token = this.jwtService.sign(payload, { expiresIn: '1h' });
    return { verify: 'ok' };
  }

  async resendOTPCode({ email }: ResendOTPDto) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    const otpCode = Math.random().toString().slice(2, 8);
    const validationDate = new Date();
    validationDate.setTime(validationDate.getTime() + 3 * 60 * 1000);

    await this.userModel.updateOne(
      { _id: user._id },
      {
        $set: { OTPCode: otpCode, OTPValidationDate: validationDate },
      },
    );
    await this.emailService.sendOtpCodeToClient(email, otpCode);
    return {
      message: 'ok',
    };
  }

  async signIn({ email, password }: SignInDto) {
    const existUser = await this.userModel
      .findOne({ email })
      .select('password verified');
    if (!existUser) {
      throw new BadRequestException('Invalid credentials');
    }
    if (!existUser.password) {
      throw new BadRequestException(
        'Account registered via Google. Please sign in with Google.',
      );
    }
    const isPasswordEqual = await bcrypt.compare(password, existUser.password);
    if (!isPasswordEqual) {
      throw new BadRequestException('Invalid credentials');
    }
    console.log(existUser, 'existuser');
    if (!existUser.verified) {
      throw new BadRequestException('you have to verify first');
    }
    const payload = {
      id: existUser._id,
    };
    const token = this.jwtService.sign(payload, { expiresIn: '1h' });
    return { token, message: 'ok' };
  }

  async continueWithGoogle({ email }): Promise<{ token: string }> {
    let existUser = await this.userModel.findOne({ email });
    if (!existUser)
      existUser = await this.userModel.create({ email, verified: true });

    const payload = { id: existUser._id };
    const token = this.jwtService.sign(payload, { expiresIn: '1h' });

    return { token };
  }

  async getCurrentUser(userId: string) {
    const user = await this.userModel.findById(userId);
    return user;
  }
  async requestPasswordReset({ email }: RequestPasswordResetDto) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      return {
        message: 'If the email exists, a password reset link has been sent',
      };
    }
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    try {
      await this.emailService.sendPasswordResetEmail(email, resetToken);
      return {
        message: 'Password reset link has been sent to your email',
      };
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      throw new BadRequestException(
        'Failed to send reset email. Please try again.',
      );
    }
  }

  async confirmPasswordReset({ token, newPassword }: ConfirmPasswordResetDto) {
    let cleanToken = token;
    if (token.includes('&') || token.includes('?')) {
      cleanToken = token.split(/[&?]/)[0];
    }
    const isValidHex = /^[a-f0-9]{64}$/i.test(cleanToken);
    if (!isValidHex) {
      throw new BadRequestException('Invalid token format');
    }
    const hashedToken = crypto
      .createHash('sha256')
      .update(cleanToken)
      .digest('hex');
    const user = await this.userModel
      .findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: new Date() },
      })
      .select('password resetPasswordToken resetPasswordExpires');

    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    return {
      message: 'Password has been reset successfully',
    };
  }
}
