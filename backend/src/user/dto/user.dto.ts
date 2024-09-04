import { Expose, plainToClass } from "class-transformer";
import { IsEmail, Length, Matches, MinLength } from "class-validator";

export class UserDTO {
  @Expose()
  id: string;

  @Expose()
  @Matches("^[a-zA-Z0-9_.]*$", undefined, {
    message: "Username can only contain letters, numbers, dots and underscores",
  })
  @Length(3, 32)
  username: string;

  @Expose()
  @IsEmail()
  email: string;

  @Expose()
  hasPassword: boolean;

  @MinLength(8)
  password: string;

  @Expose()
  isAdmin: boolean;

  @Expose()
  isLdap: boolean;

  ldapDN?: string;

  @Expose()
  totpVerified: boolean;

  from(partial: Partial<UserDTO>) {
    const result = plainToClass(UserDTO, partial, {
      excludeExtraneousValues: true,
    });
    result.isLdap = partial.ldapDN?.length > 0;
    return result;
  }

  fromList(partial: Partial<UserDTO>[]) {
    return partial.map((part) => this.from(part));
  }
}
