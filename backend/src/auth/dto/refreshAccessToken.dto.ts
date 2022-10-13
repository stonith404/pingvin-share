import { IsNotEmpty } from "class-validator";

export class RefreshAccessTokenDTO {
  @IsNotEmpty()
  refreshToken: string;
}
