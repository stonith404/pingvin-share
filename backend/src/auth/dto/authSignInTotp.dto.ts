import { IsString } from "class-validator";
import { AuthSignInDTO } from "./authSignIn.dto";

export class AuthSignInTotpDTO {
  @IsString()
  totp: string;

  @IsString()
  loginToken: string;
}
