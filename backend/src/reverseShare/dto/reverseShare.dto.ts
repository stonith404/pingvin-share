import { Expose, plainToClass } from "class-transformer";

export class ReverseShareDTO {
  @Expose()
  id: string;

  @Expose()
  maxShareSize: string;

  @Expose()
  shareExpiration: Date;

  @Expose()
  sharesOptions: string;

  from(partial: Partial<ReverseShareDTO>) {
    return plainToClass(ReverseShareDTO, partial, {
      excludeExtraneousValues: true,
    });
  }
}
