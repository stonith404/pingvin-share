import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { ConfigService } from "src/config/config.service";

@Injectable()
export class FileValidationPipe implements PipeTransform {
  constructor(private config: ConfigService) {}
  async transform(value: any, metadata: ArgumentMetadata) {
    // "value" is an object containing the file's attributes and metadata
    console.log(this.config.get("maxFileSize"));
    const oneKb = 1000;
    return value.size < oneKb;
  }
}
