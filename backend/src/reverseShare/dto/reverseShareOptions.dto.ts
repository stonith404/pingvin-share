import { Expose, plainToClass } from "class-transformer";

export class ReverseShareOptionsDTO {
  @Expose()
  easyMode: boolean;
  @Expose()
  customLinkEnabled: boolean;
  @Expose()
  passwordEnabled: boolean;
  @Expose()
  descriptionEnabled: boolean;
  @Expose()
  maximalViewsEnabled: boolean;
}