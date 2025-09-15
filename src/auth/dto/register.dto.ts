import { IsEmail, IsNotEmpty, IsString, IsIn, IsInt, Min } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsIn(['student', 'teacher'])
  role: 'student' | 'teacher';

  @IsInt()
  @Min(1)
  year: number;
}
