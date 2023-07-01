import { Expose, plainToClass } from "class-transformer";
import {ReverseShareOptionsDTO} from "./reverseShareOptions.dto";

export class ReverseShareDTO {
  @Expose()
  id: string;

  @Expose()
  maxShareSize: string;

  @Expose()
  shareExpiration: Date;

  @Expose()
  sharesOptions: ReverseShareOptionsDTO;

  from(partial: Partial<ReverseShareDTO>) {
    return plainToClass(ReverseShareDTO, partial, {
      excludeExtraneousValues: true,
    });
  }
}
