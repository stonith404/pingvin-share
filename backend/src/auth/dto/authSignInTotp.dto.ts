import { IsString } from "class-validator";
import { AuthSignInDTO } from "./authSignIn.dto";

export class AuthSignInTotpDTO extends AuthSignInDTO {
  @IsString()
  totp: string;

  @IsString()
  loginToken: string;
}
