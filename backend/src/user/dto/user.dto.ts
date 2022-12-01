import { Expose, plainToClass } from "class-transformer";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UserDTO {
  @Expose()
  id: string;

  @Expose()
  @IsOptional()
  @IsString()
  username: string;

  @Expose()
  @IsOptional()
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
}
