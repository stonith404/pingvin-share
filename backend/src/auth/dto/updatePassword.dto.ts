import { PickType } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { UserDTO } from "src/user/dto/user.dto";

export class UpdatePasswordDTO extends PickType(UserDTO, ["password"]) {
  @IsString()
  oldPassword: string;
}
