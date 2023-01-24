import { Expose, plainToClass } from "class-transformer";
import { IsString } from "class-validator";

export class ReverseShareTokenDTO {
  @IsString()
  @Expose()
  maxShareSize: string;

  @IsString()
  @Expose()
  expiration: string;

  from(partial: Partial<ReverseShareTokenDTO>) {
    return plainToClass(ReverseShareTokenDTO, partial, {
      excludeExtraneousValues: true,
    });
  }
}
