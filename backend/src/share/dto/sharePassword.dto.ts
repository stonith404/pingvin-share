import { IsOptional, IsString } from "class-validator";

export class SharePasswordDto {
  @IsString()
  @IsOptional()
  password: string;
}
