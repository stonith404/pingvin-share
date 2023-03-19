import { IsNotEmpty, IsString } from "class-validator";

class UpdateConfigDTO {
  @IsString()
  key: string;

  @IsNotEmpty()
  editedValue: string | number | boolean;
}

export default UpdateConfigDTO;
