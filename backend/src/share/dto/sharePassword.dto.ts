import { IsNotEmpty } from "class-validator";

export class SharePasswordDto {
  @IsNotEmpty()
  password: string;
}
