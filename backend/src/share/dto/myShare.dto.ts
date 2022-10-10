import { Expose, plainToClass } from "class-transformer";
import { ShareDTO } from "./share.dto";

export class MyShareDTO extends ShareDTO {
  @Expose()
  views: number;

  @Expose()
  createdAt: Date;

  from(partial: Partial<MyShareDTO>) {
    return plainToClass(MyShareDTO, partial, { excludeExtraneousValues: true });
  }

  fromList(partial: Partial<MyShareDTO>[]) {
    return partial.map((part) =>
      plainToClass(MyShareDTO, part, { excludeExtraneousValues: true })
    );
  }
}
