import { OmitType } from "@nestjs/mapped-types";
import { Expose, plainToClass, Type } from "class-transformer";
import { MyShareDTO } from "src/share/dto/myShare.dto";
import { ReverseShareDTO } from "./reverseShare.dto";

export class ReverseShareTokenWithShare extends OmitType(ReverseShareDTO, [
  "shareExpiration",
] as const) {
  @Expose()
  shareExpiration: Date;

  @Expose()
  @Type(() => OmitType(MyShareDTO, ["recipients"] as const))
  share: Omit<MyShareDTO, "recipients" | "files" | "from" | "fromList">;

  fromList(partial: Partial<ReverseShareTokenWithShare>[]) {
    return partial.map((part) =>
      plainToClass(ReverseShareTokenWithShare, part, {
        excludeExtraneousValues: true,
      })
    );
  }
}
