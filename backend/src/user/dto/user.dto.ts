import { Expose, plainToClass } from "class-transformer";
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from "class-validator";

export class UserDTO {
  @Expose()
  id: string;

  @Expose()
  @Expose()
  @Matches("^[a-zA-Z0-9_.]*$", undefined, {
    message: "Username can only contain letters, numbers, dots and underscores",
  })
  @Length(3, 32)
  username: string;

  @Expose()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @Expose()
  isAdmin: boolean;

  from(partial: Partial<UserDTO>) {
    return plainToClass(UserDTO, partial, { excludeExtraneousValues: true });
  }

  fromList(partial: Partial<UserDTO>[]) {
    return partial.map((part) =>
      plainToClass(UserDTO, part, { excludeExtraneousValues: true })
    );
  }
}
