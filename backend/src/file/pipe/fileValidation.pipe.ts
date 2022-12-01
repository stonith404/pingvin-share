import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from "@nestjs/common";
import { ConfigService } from "src/config/config.service";

@Injectable()
export class FileValidationPipe implements PipeTransform {
  constructor(private config: ConfigService) {}
  async transform(value: any, metadata: ArgumentMetadata) {
    if (value.size > this.config.get("maxFileSize"))
      throw new BadRequestException("File is ");
    return value;
  }
}
