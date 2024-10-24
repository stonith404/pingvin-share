import { IsEmail, IsOptional, IsString } from "class-validator";

export class AuthSignInDTO {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  username: string;

  @IsString()
  password: string;
}
