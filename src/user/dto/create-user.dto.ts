import { IsEmail, IsStrongPassword, Length } from 'class-validator';

export class CreateUserDto {
  @Length(5, 20)
  username: string;

  @IsEmail()
  email: string;

  @IsStrongPassword({ minLength: 4, minLowercase: 1, minNumbers: 1, minSymbols: 0, minUppercase: 0 })
  password: string;

  repassword: string;
}
