import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateSurveyDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500) // Example max length for response
  response: string;
}
