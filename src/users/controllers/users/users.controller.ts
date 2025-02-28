import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';
import { UpdateUserDto } from 'src/users/dtos/UpdateUser.dto';
import { UsersService } from 'src/users/services/users/users.service';
import { Request, Response } from 'express';
import { UsersGuard } from 'src/users/guards/users/users.guard';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

import { JWT_SECRET } from 'src/users/guards/users/users.guard';
import { LoginUserDto } from 'src/users/dtos/LoginUser.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  async getUsers() {
    return await this.userService.findUsers();
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const { confirmPassword, ...userDetails } = createUserDto;

    if (confirmPassword !== userDetails.password)
      return res.status(401).send({ error: 'Passwords do not match' });

    userDetails.password = await this.hashPassword(userDetails.password);

    const user = await this.userService.createUser(userDetails);
    const token = this.generateToken(user);
    res.cookie('jwt', token, { httpOnly: true });
    return res.status(201).send({ message: 'User created successfully' });
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    const user = await this.userService.findUserByEmail(loginUserDto.email);

    if (!user) return res.status(401).send({ error: 'Invalid credentials' });

    const isPasswordValid = await this.comparePasswords(
      loginUserDto.password,
      user.password,
    );

    if (!isPasswordValid)
      return res.status(401).send({ error: 'Invalid credentials' });

    const token = this.generateToken(user);
    res.cookie('jwt', token, { httpOnly: true });
    return res.send({ message: 'Login successful' });
  }

  @Patch(':id')
  @UseGuards(UsersGuard)
  async updateUserById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const token = req.cookies['jwt'];
    const decoded = this.decodeIdFromToken(token);

    if (decoded.id !== id)
      return res.status(401).send({ error: 'Unauthorized' });

    const { ...userDetails } = updateUserDto;

    if (userDetails.password)
      userDetails.password = await this.hashPassword(userDetails.password);

    await this.userService.updateUser(userDetails, id);
    return res.send({ message: 'User updated successfully' });
  }

  @Delete(':id')
  @UseGuards(UsersGuard)
  async deleteUserById(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const token = req.cookies['jwt'];
    const decoded = this.decodeIdFromToken(token);

    if (decoded.id !== id)
      return res.status(401).send({ error: 'Unauthorized' });

    await this.userService.deleteUser(id);
    return res.send({ message: 'User deleted successfully' });
  }

  private generateToken(user: any) {
    return jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: 86400 });
  }

  private async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  private async comparePasswords(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }

  private decodeIdFromToken(token: string) {
    return jwt.verify(token, JWT_SECRET) as { id: number };
  }
}
