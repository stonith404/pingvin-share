import { OmitType } from "@nestjs/mapped-types";
import { Expose, plainToClass, Type } from "class-transformer";
import { MyShareDTO } from "src/share/dto/myShare.dto";
import { ReverseShareTokenDTO } from "./reverseShareToken.dto";

export class ReverseShareTokenWithShareDTO extends OmitType(
  ReverseShareTokenDTO,
  ["expiration"] as const
) {
  @Expose()
  expiration: Date;

  @Expose()
  @Type(() => MyShareDTO)
  share: MyShareDTO;

  fromList(partial: Partial<ReverseShareTokenWithShareDTO>[]) {
    return partial.map((part) =>
      plainToClass(ReverseShareTokenWithShareDTO, part, {
        excludeExtraneousValues: true,
      })
    );
  }
}
