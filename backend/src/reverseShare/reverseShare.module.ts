import { forwardRef, Module } from "@nestjs/common";
import { FileModule } from "src/file/file.module";
import { ReverseShareController } from "./reverseShare.controller";
import { ReverseShareService } from "./reverseShare.service";

@Module({
  imports: [forwardRef(()=>FileModule)],
  controllers: [ReverseShareController],
  providers: [ReverseShareService],
  exports: [ReverseShareService],
})
export class ReverseShareModule {}
