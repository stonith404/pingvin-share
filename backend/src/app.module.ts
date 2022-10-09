import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { AuthModule } from "./auth/auth.module";
import { JobsService } from "./auth/jobs/jobs.service";

import { FileController } from "./file/file.controller";
import { FileModule } from "./file/file.module";
import { PrismaModule } from "./prisma/prisma.module";
import { PrismaService } from "./prisma/prisma.service";
import { ShareController } from "./share/share.controller";
import { ShareModule } from "./share/share.module";
import { UserController } from "./user/user.controller";

@Module({
  imports: [
    AuthModule,
    ShareModule,
    FileModule,
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
  ],
  providers: [PrismaService, JobsService],
  controllers: [UserController, ShareController, FileController],
})
export class AppModule {}
