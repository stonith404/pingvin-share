import { Expose } from "class-transformer";

export class MyShareSecurityDTO {
  @Expose()
  passwordProtected: boolean;

  @Expose()
  maxViews: number;
}
