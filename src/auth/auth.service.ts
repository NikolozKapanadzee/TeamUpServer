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
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { RecoverPasswordDTO } from './dto/recover-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}
  async signUp({ email, password }: SignUpDto) {
    const existUser = await this.userModel.findOne({ email });
    if (existUser) {
      throw new BadRequestException('user alredy exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await this.userModel.create({
      email,
      password: hashedPassword,
    });
    return { message: 'sign up passed successfully', data: newUser };
  }

  async recoverPassword(recoverPasswordDto: RecoverPasswordDTO) {
    const { password, email } = recoverPasswordDto;
    const user = await this.userModel.find({ email });
    if (!user) throw new NotFoundException('user not found');
  }

  async signIn({ email, password }: SignInDto) {
    const existUser = await this.userModel
      .findOne({ email })
      .select('password');
    if (!existUser) {
      throw new BadRequestException('Invalid credentials');
    }
    const isPasswordEqual = await bcrypt.compare(password, existUser.password);
    if (!isPasswordEqual) {
      throw new BadRequestException('Invalid credentials');
    }
    const payload = {
      id: existUser._id,
    };
    const token = this.jwtService.sign(payload, { expiresIn: '1h' });
    return { token };
  }
  async getCurrentUser(userId) {
    const user = await this.userModel.findById(userId);
    return user;
  }
}
