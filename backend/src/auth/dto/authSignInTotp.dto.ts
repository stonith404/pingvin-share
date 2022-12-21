import { PickType } from "@nestjs/mapped-types";
import { IsEmail, IsOptional, IsString } from "class-validator";
import { UserDTO } from "src/user/dto/user.dto";

export class AuthSignInTotpDTO extends PickType(UserDTO, [
  "password",
] as const) {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  username: string;

  @IsString()
  totp: string;

  @IsString()
  loginToken: string;
}
