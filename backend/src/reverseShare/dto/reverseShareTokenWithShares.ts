import { OmitType } from "@nestjs/swagger";
import { Expose, plainToClass, Type } from "class-transformer";
import { MyShareDTO } from "src/share/dto/myShare.dto";
import { ReverseShareDTO } from "./reverseShare.dto";

export class ReverseShareTokenWithShares extends OmitType(ReverseShareDTO, [
  "shareExpiration",
] as const) {
  @Expose()
  shareExpiration: Date;

  @Expose()
  @Type(() => OmitType(MyShareDTO, ["recipients", "hasPassword"] as const))
  shares: Omit<
    MyShareDTO,
    "recipients" | "files" | "from" | "fromList" | "hasPassword"
  >[];

  @Expose()
  remainingUses: number;

  fromList(partial: Partial<ReverseShareTokenWithShares>[]) {
    return partial.map((part) =>
      plainToClass(ReverseShareTokenWithShares, part, {
        excludeExtraneousValues: true,
      }),
    );
  }
}
