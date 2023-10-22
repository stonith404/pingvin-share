import { PickType } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { UserDTO } from "src/user/dto/user.dto";

export class UpdatePasswordDTO extends PickType(UserDTO, ["password"]) {
  @IsString()
  @IsOptional()
  oldPassword?: string;
}
