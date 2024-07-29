import { Expose, plainToClass } from "class-transformer";
import { ShareDTO } from "./share.dto";

export class ShareCompleteDTO extends ShareDTO {
  @Expose()
  isSendEmailToReverseShareCreator?: boolean;

  from(partial: Partial<ShareCompleteDTO>) {
    return plainToClass(ShareCompleteDTO, partial, {
      excludeExtraneousValues: true,
    });
  }

  fromList(partial: Partial<ShareCompleteDTO>[]) {
    return partial.map((part) =>
      plainToClass(ShareCompleteDTO, part, { excludeExtraneousValues: true }),
    );
  }
}
