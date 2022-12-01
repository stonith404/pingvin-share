import { PickType } from "@nestjs/swagger";
import { UserDTO } from "src/user/dto/user.dto";

export class AuthSignInDTO extends PickType(UserDTO, [
  "username",
  "email",
  "password",
] as const) {}
