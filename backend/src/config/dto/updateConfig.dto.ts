import { IsNotEmpty, IsString, ValidateIf } from "class-validator";

class UpdateConfigDTO {
  @IsString()
  key: string;

  // @IsNotEmpty()
  // @ValidateIf((dto) => dto.value !== "")
  // value: string | number | boolean;

  @IsNotEmpty()
  editedValue: string | number | boolean;
}

export default UpdateConfigDTO;
