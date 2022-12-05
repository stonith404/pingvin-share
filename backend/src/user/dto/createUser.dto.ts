import { Expose, plainToClass } from "class-transformer";
import { Allow } from "class-validator";
import { UserDTO } from "./user.dto";

export class CreateUserDTO extends UserDTO{

  @Expose()
  @Allow()
  isAdmin: boolean;

  from(partial: Partial<CreateUserDTO>) {
    return plainToClass(CreateUserDTO, partial, { excludeExtraneousValues: true });
  }
}
