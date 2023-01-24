import { IsString } from "class-validator";

export class CreateReverseShareDTO {
  @IsString()
  maxShareSize: string;

  @IsString()
  shareExpiration: string;
}
