import { PickType } from "@nestjs/mapped-types";
import { UserDTO } from "./user.dto";

export class PublicUserDTO extends PickType(UserDTO, ["username"] as const) {}
