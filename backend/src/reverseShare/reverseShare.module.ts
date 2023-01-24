import { Module } from "@nestjs/common";
import { ReverseShareController } from "./reverseShare.controller";
import { ReverseShareService } from "./reverseShare.service";

@Module({
  controllers: [ReverseShareController],
  providers: [ReverseShareService],
  exports: [ReverseShareService],
})
export class ReverseShareModule {}
