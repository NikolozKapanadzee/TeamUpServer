import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { User } from './schema/users.schema';
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async getAllUsers() {
    return await this.userModel.find();
  }
  async getUserById(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }
  async createUser(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    const existUser = await this.userModel.findOne({ email });
    if (existUser) {
      throw new BadRequestException('email already exists');
    }
    if (!email || !password) {
      throw new HttpException(
        'email and password are required',
        HttpStatus.BAD_REQUEST,
      );
    }
    const createdUser = await this.userModel.create({ email, password });
    return {
      message: 'user successfully created',
      user: createdUser,
    };
  }
  async deleteUserById(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    const user = await this.userModel.findByIdAndDelete(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return { message: 'user successfully deleted', user: user };
  }
  async updateUserById(id: string, updateUserDto: UpdateUserDto) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      updateUserDto,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!updatedUser) {
      throw new NotFoundException('user not found');
    }
    return {
      message: 'user successfully updated',
      user: updatedUser,
    };
  }
}
