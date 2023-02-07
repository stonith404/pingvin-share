import { PickType } from "@nestjs/swagger";
import { UserDTO } from "src/user/dto/user.dto";

export class EnableTotpDTO extends PickType(UserDTO, ["password"] as const) {}
