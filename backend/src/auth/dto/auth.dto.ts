import { Expose, plainToClass } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class AuthDTO {
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

  constructor(partial: Partial<AuthDTO>) {
    return plainToClass(AuthDTO, partial, { excludeExtraneousValues: true });
  }
}
