import { OmitType, PartialType } from "@nestjs/mapped-types";
import { UserDTO } from "./user.dto";

export class UpdateOwnUserDTO extends PartialType(
  OmitType(UserDTO, ["isAdmin"] as const)
) {}
