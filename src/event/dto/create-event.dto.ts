import {
  Length,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsDate,
  IsDateString,
} from 'class-validator';

export class CreateEventDto {
  @Length(4, 20)
  name: string;

  @Length(5, 300)
  description: string;

  @IsDateString()
  when: string;

  @IsDateString()
  finish: string;

  @IsNotEmpty()
  @Length(4, 30)
  address: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}
