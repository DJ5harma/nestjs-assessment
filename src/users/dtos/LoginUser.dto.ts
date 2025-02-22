import { IsNotEmpty, IsString } from 'class-validator';

// DTO for logging in a user
export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
