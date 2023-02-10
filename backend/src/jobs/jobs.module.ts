import { Module } from "@nestjs/common";
import { FileModule } from "src/file/file.module";
import { ReverseShareModule } from "src/reverseShare/reverseShare.module";
import { JobsService } from "./jobs.service";

@Module({
  imports: [FileModule, ReverseShareModule],
  providers: [JobsService],
})
export class JobsModule {}
