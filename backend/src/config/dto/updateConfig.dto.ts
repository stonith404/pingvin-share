import { IsNotEmpty, ValidateIf } from "class-validator";

class UpdateConfigDTO {
  @IsNotEmpty()
  @ValidateIf((dto) => dto.value !== "")
  value: string | number | boolean;
}

export default UpdateConfigDTO;
