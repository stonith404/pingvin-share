import { Expose, plainToClass } from "class-transformer";

export class TokenDTO {
  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;

  from(partial: Partial<TokenDTO>) {
    return plainToClass(TokenDTO, partial, {
      excludeExtraneousValues: true,
    });
  }
}
