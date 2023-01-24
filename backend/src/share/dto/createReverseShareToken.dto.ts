import { IsString } from "class-validator";

export class CreateReverseShareTokenDTO {
  @IsString()
  expiration: string;
}
