import { Expose, plainToClass } from "class-transformer";

export class ShareMetaDataDTO {
  @Expose()
  id: string;

  from(partial: Partial<ShareMetaDataDTO>) {
    return plainToClass(ShareMetaDataDTO, partial, {
      excludeExtraneousValues: true,
    });
  }
}
