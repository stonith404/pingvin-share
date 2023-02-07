import { OmitType } from "@nestjs/swagger";
import { Expose, plainToClass, Type } from "class-transformer";
import { MyShareDTO } from "src/share/dto/myShare.dto";
import { ReverseShareDTO } from "./reverseShare.dto";

export class ReverseShareTokenWithShare extends OmitType(ReverseShareDTO, [
  "shareExpiration",
] as const) {
  @Expose()
  shareExpiration: Date;

  @Expose()
  @Type(() => OmitType(MyShareDTO, ["recipients", "hasPassword"] as const))
  share: Omit<
    MyShareDTO,
    "recipients" | "files" | "from" | "fromList" | "hasPassword"
  >;

  fromList(partial: Partial<ReverseShareTokenWithShare>[]) {
    return partial.map((part) =>
      plainToClass(ReverseShareTokenWithShare, part, {
        excludeExtraneousValues: true,
      })
    );
  }
}
