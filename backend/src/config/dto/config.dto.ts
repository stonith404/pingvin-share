import { Expose, plainToClass } from "class-transformer";

export class ConfigDTO {
  @Expose()
  key: string;

  @Expose()
  value: string;

  @Expose()
  editedValue: string;

  @Expose()
  type: string;

  fromList(partial: Partial<ConfigDTO>[]) {
    return partial.map((part) =>
      plainToClass(ConfigDTO, part, { excludeExtraneousValues: true })
    );
  }
}
