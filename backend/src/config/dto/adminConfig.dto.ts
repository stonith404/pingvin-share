import { Expose, plainToClass } from "class-transformer";
import { ConfigDTO } from "./config.dto";

export class AdminConfigDTO extends ConfigDTO {
  @Expose()
  name: string;

  @Expose()
  secret: boolean;

  @Expose()
  updatedAt: Date;

  @Expose()
  description: string;

  @Expose()
  obscured: boolean;


  from(partial: Partial<AdminConfigDTO>) {
    return plainToClass(AdminConfigDTO, partial, {
      excludeExtraneousValues: true,
    });
  }

  fromList(partial: Partial<AdminConfigDTO>[]) {
    return partial.map((part) =>
      plainToClass(AdminConfigDTO, part, { excludeExtraneousValues: true })
    );
  }
}
