import { PickType } from "@nestjs/swagger";
import { UserDTO } from "src/user/dto/user.dto";

export class AuthSignInDTO extends PickType(UserDTO, [
  "email",
  "password",
] as const) {}
