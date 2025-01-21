import { IsString } from "class-validator";

export class EnableTotpDTO {
  @IsString()
  password: string;
}
