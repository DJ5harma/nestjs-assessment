import { IsEmail, IsOptional, IsString } from 'class-validator';

// DTO for updating a user
export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  password?: string;
}
