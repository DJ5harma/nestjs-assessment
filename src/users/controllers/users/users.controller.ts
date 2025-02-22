import { Controller, Get, Post } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get()
  getUsers() {
    return 'All users';
  }

  @Post()
  createUser() {
    return 'User created';
  }
}
