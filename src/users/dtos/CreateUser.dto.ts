import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

// DTO for creating a user
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  confirmPassword: string;
}
