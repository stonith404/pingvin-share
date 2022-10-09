import { PickType } from "@nestjs/swagger";
import { AuthDTO } from "./auth.dto";

export class AuthSignInDTO extends PickType(AuthDTO, [
  "email",
  "password",
] as const) {}
