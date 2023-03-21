import { IsNotEmpty, IsString } from "class-validator";

class UpdateConfigDTO {
  @IsString()
  key: string;

  @IsNotEmpty()
  value: string | number | boolean;
}

export default UpdateConfigDTO;
