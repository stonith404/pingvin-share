import { Type } from "class-transformer";
import { IsString, Matches, ValidateNested } from "class-validator";
import { ShareSecurityDTO } from "./shareSecurity.dto";

export class CreateShareDTO {
  @IsString()
  @Matches("^[a-zA-Z0-9_-]*$", undefined, {
    message: "ID only can contain letters, numbers, underscores and hyphens",
  })
  id: string;

  @IsString()
  expiration: string;

  @ValidateNested()
  @Type(() => ShareSecurityDTO)
  security: ShareSecurityDTO;
}
