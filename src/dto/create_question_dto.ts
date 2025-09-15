import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsDateString,
  ValidateNested,
  IsArray,
  IsOptional,
} from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsString()
  type: 'mcq' | 'text';

  @IsOptional()
  @IsArray()
  options?: string[];

  @IsOptional()
  correctAnswer?: string | string[];
}
