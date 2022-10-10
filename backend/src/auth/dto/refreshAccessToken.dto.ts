import { IsNotEmpty, IsString } from "class-validator";

export class RefreshAccessTokenDTO {
  @IsNotEmpty()
  refreshToken: string;
}
