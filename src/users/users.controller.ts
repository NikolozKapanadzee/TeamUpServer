import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(private UsersService: UsersService) {}
  @Get()
  getAllUsers() {
    return this.UsersService.getAllUsers();
  }
  @Get(':id')
  getUserById(@Param('id') id) {
    console.log(id, 'id');
    return this.UsersService.getUserById(Number(id));
  }
  @Post()
  createUser(@Body() CreateUserDto: CreateUserDto) {
    const email = CreateUserDto?.email;
    const password = CreateUserDto?.password;
    return this.UsersService.createUser({ email, password });
  }
  @Delete(':id')
  deleteUserById(@Param('id') id) {
    return this.UsersService.deleteUserById(Number(id));
  }
  @Put(':id')
  updateUserById(@Param('id') id, @Body() UpdateUserDto: UpdateUserDto) {
    return this.UsersService.updateUserById(Number(id), UpdateUserDto);
  }
}
