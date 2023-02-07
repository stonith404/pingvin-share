import { PickType } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString } from "class-validator";
import { UserDTO } from "src/user/dto/user.dto";

export class AuthSignInDTO extends PickType(UserDTO, ["password"] as const) {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  username: string;
}
