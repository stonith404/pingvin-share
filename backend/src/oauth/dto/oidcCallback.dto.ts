import { IsString } from "class-validator";

export class OidcCallbackDto {
  @IsString()
  code: string;

  @IsString()
  state: string;
}