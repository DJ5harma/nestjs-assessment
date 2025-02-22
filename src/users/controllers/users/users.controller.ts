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
import { CreateUserDto } from '../../../../src/users/dtos/CreateUser.dto';
import { UpdateUserDto } from '../../../../src/users/dtos/UpdateUser.dto';
import { UsersService } from '../../../../src/users/services/users/users.service';
import { Request, Response } from 'express';
import { UsersGuard } from '../../../../src/users/guards/users/users.guard';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

import { JWT_SECRET } from '../../../../src/users/guards/users/users.guard';
import { LoginUserDto } from '../../../../src/users/dtos/LoginUser.dto';

// This controller is responsible for handling all user-related operations
// It uses the UsersService to interact with the database
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  // Get all users
  @Get()
  async getUsers() {
    return await this.userService.findUsers();
  }

  // Create a new user
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const { confirmPassword, ...userDetails } = createUserDto;

    // Check if passwords match
    if (confirmPassword !== userDetails.password)
      return res.status(401).send({ error: 'Passwords do not match' });

    // Hash the password
    userDetails.password = await this.hashPassword(userDetails.password);

    // Create the user and generate a token
    const user = await this.userService.createUser(userDetails);
    const token = this.generateToken(user);
    res.cookie('jwt', token, { httpOnly: true });
    return res.send({ message: 'User created successfully' });
  }

  // Login a user
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    const user = await this.userService.findUserByEmail(loginUserDto.email);

    // Check if user exists
    if (!user) return res.status(401).send({ error: 'Invalid credentials' });

    // Check if password is valid
    const isPasswordValid = await this.comparePasswords(
      loginUserDto.password,
      user.password,
    );

    if (!isPasswordValid)
      return res.status(401).send({ error: 'Invalid credentials' });

    // Generate a token and set it in cookies
    const token = this.generateToken(user);
    res.cookie('jwt', token, { httpOnly: true });
    return res.send({ message: 'Login successful' });
  }

  // Update a user by ID
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

    // Check if the user is authorized to update
    if (decoded.id !== id)
      return res.status(401).send({ error: 'Unauthorized' });

    const { ...userDetails } = updateUserDto;

    // Hash the new password if provided
    if (userDetails.password)
      userDetails.password = await this.hashPassword(userDetails.password);

    await this.userService.updateUser(userDetails, id);
    return res.send({ message: 'User updated successfully' });
  }

  // Delete a user by ID
  @Delete(':id')
  @UseGuards(UsersGuard)
  async deleteUserById(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const token = req.cookies['jwt'];
    const decoded = this.decodeIdFromToken(token);

    // Check if the user is authorized to delete
    if (decoded.id !== id)
      return res.status(401).send({ error: 'Unauthorized' });

    await this.userService.deleteUser(id);
    return res.send({ message: 'User deleted successfully' });
  }

  // Generate a JWT token
  private generateToken(user: any) {
    return jwt.sign(
      { id: user.id },
      JWT_SECRET, // secret
      { expiresIn: 86400 }, // expires in 24 hours
    );
  }

  // Hash a password
  private async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  // Compare passwords
  private async comparePasswords(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }

  // Decode ID from token
  private decodeIdFromToken(token: string) {
    return jwt.verify(token, JWT_SECRET) as { id: number };
  }
}
