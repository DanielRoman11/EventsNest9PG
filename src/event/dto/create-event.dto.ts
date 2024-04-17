import {
  Length,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';

export class CreateEventDto {
  @Length(4, 20)
  name: string;

  @Length(5, 300)
  description: string;

  @IsDateString()
  when: Date;

  @IsNotEmpty()
  @Length(4, 30)
  address: string;
}
