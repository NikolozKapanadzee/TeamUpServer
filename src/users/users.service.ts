import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class UsersService {
  private users = [
    {
      id: 1,
      email: 'user1@gmail.com',
      password: 'zzzaaaqqq',
    },
    {
      id: 2,
      email: 'user2@gmail.com',
      password: 'qqqaaazzz',
    },
  ];
  getAllUsers() {
    return this.users;
  }
  getUserById(id) {
    const index = this.users.findIndex((el) => el.id === id);
    if (index === -1) {
      throw new NotFoundException('user not found');
    }
    const user = this.users.find((el) => el.id === id);
    return user;
  }
  createUser({ email, password }: CreateUserDto) {
    if (!email || !password) {
      throw new HttpException(
        'email and password are required',
        HttpStatus.BAD_REQUEST,
      );
    }
    const lastId = this.users[this.users.length - 1]?.id || 0;
    const newUser = {
      id: lastId + 1,
      email,
      password,
    };
    this.users.push(newUser);
    return 'congrats user has been created';
  }
  deleteUserById(id) {
    const index = this.users.findIndex((el) => el.id === id);
    if (index === -1) {
      throw new NotFoundException('user not found');
    }
    this.users.splice(index, 1);
    return 'deleted';
  }
  updateUserById(id, UpdateUserDto: UpdateUserDto) {
    const index = this.users.findIndex((el) => el.id === id);
    if (index === -1) {
      throw new NotFoundException('user not found');
    }
    const updateReq: UpdateUserDto = {};
    if (UpdateUserDto.email) {
      updateReq.email = UpdateUserDto.email;
    }
    if (UpdateUserDto.password) {
      updateReq.password = UpdateUserDto.password;
    }
    this.users[index] = {
      ...this.users[index],
      ...updateReq,
    };
    return 'updated';
  }
}
