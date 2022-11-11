import { Type } from "class-transformer";
import {
  IsEmail,
  IsString,
  Length,
  Matches,
  ValidateNested,
} from "class-validator";
import { ShareSecurityDTO } from "./shareSecurity.dto";

export class CreateShareDTO {
  @IsString()
  @Matches("^[a-zA-Z0-9_-]*$", undefined, {
    message: "ID only can contain letters, numbers, underscores and hyphens",
  })
  @Length(3, 50)
  id: string;

  @IsString()
  expiration: string;

  @IsEmail({}, { each: true })
  recipients: string[];

  @ValidateNested()
  @Type(() => ShareSecurityDTO)
  security: ShareSecurityDTO;
}
