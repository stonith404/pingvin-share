import { IsString } from "class-validator";

export class GithubDto {
  @IsString()
  code: string;
  @IsString()
  state: string;
}