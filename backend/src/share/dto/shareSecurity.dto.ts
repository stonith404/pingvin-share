import { IsNumber, IsOptional, IsString, Length } from "class-validator";

export class ShareSecurityDTO {
  @IsString()
  @IsOptional()
  @Length(3, 30)
  password: string;

  @IsNumber()
  @IsOptional()
  maxViews: number;
}
