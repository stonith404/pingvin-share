
import { PickType } from "@nestjs/mapped-types";
import { UserDTO } from "src/user/dto/user.dto";

export class AuthRegisterDTO extends PickType(UserDTO, ["email", "username", "password"] as const) {
}
