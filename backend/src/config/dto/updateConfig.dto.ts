import { IsNotEmpty } from "class-validator";

class UpdateConfigDTO {
  @IsNotEmpty()
  value: string | number | boolean;
}

export default UpdateConfigDTO;
