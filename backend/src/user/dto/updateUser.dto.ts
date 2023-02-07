import { PartialType } from "@nestjs/swagger";
import { CreateUserDTO } from "./createUser.dto";

export class UpdateUserDto extends PartialType(CreateUserDTO) {}
