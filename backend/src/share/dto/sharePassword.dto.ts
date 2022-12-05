import { IsString } from "class-validator";

export class SharePasswordDto {
  @IsString()
  password: string;
}
