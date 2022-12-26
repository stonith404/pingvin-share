import { PickType } from "@nestjs/mapped-types";
import { UserDTO } from "src/user/dto/user.dto";

export class EnableTotpDTO extends PickType(UserDTO, ["password"] as const) {}
