import { IsString } from "class-validator";

export class OAuthCallbackDto {
  @IsString()
  code: string;

  @IsString()
  state: string;
}