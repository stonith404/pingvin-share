import { Module } from "@nestjs/common";
import { FileModule } from "src/file/file.module";
import { JobsService } from "./jobs.service";

@Module({
  imports: [FileModule],
  providers: [JobsService],
})
export class JobsModule {}
