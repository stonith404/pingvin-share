import { IsEmail, IsNotEmpty } from "class-validator";

export class TestEmailDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
