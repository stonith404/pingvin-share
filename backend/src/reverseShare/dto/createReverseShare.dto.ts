import { IsBoolean, IsString, Max, Min } from "class-validator";

export class CreateReverseShareDTO {
  @IsBoolean()
  sendEmailNotification: boolean;

  @IsString()
  maxShareSize: string;

  @IsString()
  shareExpiration: string;

  @IsBoolean()
  easyMode: boolean;

  @IsBoolean()
  customLinkEnabled: boolean;

  @IsBoolean()
  passwordEnabled: boolean;

  @IsBoolean()
  descriptionEnabled: boolean;

  @IsBoolean()
  maximalViewsEnabled: boolean;


  @Min(1)
  @Max(1000)
  maxUseCount: number;
}
