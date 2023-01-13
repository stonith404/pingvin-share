import { forwardRef, Module } from "@nestjs/common";
import { FileModule } from "src/file/file.module";
import { ClamScanService } from "./clamscan.service";

@Module({
  imports: [forwardRef(() => FileModule)],
  providers: [ClamScanService],
  exports: [ClamScanService],
})
export class ClamscanModule {}
