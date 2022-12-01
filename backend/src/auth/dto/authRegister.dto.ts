import { PickType } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsEmail, Length, Matches } from "class-validator";
import { UserDTO } from "src/user/dto/user.dto";

export class AuthRegisterDTO extends PickType(UserDTO, ["password"] as const) {
  @Expose()
  @Matches("^[a-zA-Z0-9_.]*$", undefined, {
    message: "Username can only contain letters, numbers, dots and underscores",
  })
  @Length(3, 32)
  username: string;

  @Expose()
  @IsEmail()
  email: string;
}
