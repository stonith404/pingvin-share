import { OmitType, PartialType } from "@nestjs/swagger";
import { UserDTO } from "./user.dto";

export class UpdateOwnUserDTO extends PartialType(
  OmitType(UserDTO, ["isAdmin", "password"] as const),
) {}
