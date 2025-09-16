import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsIn,
  IsInt,
  Min,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty({ message: 'Name should not be empty' })
  name: string;

  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password should not be empty' })
  password: string;

  @IsIn(['student', 'teacher'])
  role: 'student' | 'teacher';

  @IsInt()
  @Min(1, { message: 'Year must be a positive integer' })
  year: number;
}
