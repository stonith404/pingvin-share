import {Expose, plainToClass, Type} from "class-transformer";
import {ReverseShareOptionsDTO} from "./reverseShareOptions.dto";

export class ReverseShareDTO {
  @Expose()
  id: string;

  @Expose()
  maxShareSize: string;

  @Expose()
  shareExpiration: Date;

  @Expose()
  @Type(() => ReverseShareOptionsDTO)
  sharesOptions: ReverseShareOptionsDTO;

  @Expose()
  token: string;

  from(partial: Partial<ReverseShareDTO>) {
    return plainToClass(ReverseShareDTO, partial, {
      excludeExtraneousValues: true,
    });
  }
}
