import { Expose, plainToClass } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class UserDTO {
  @Expose()
  id: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  from(partial: Partial<UserDTO>) {
    return plainToClass(UserDTO, partial, { excludeExtraneousValues: true });
  }
}
