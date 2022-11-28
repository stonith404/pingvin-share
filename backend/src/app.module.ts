import { Module } from "@nestjs/common";

import { ScheduleModule } from "@nestjs/schedule";
import { AuthModule } from "./auth/auth.module";
import { JobsService } from "./jobs/jobs.service";

import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { ConfigModule } from "./config/config.module";
import { ConfigService } from "./config/config.service";
import { EmailModule } from "./email/email.module";
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
    EmailModule,
    PrismaModule,
    ConfigModule,
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 100,
    }),
    ScheduleModule.forRoot(),
  ],
  providers: [
    ConfigService,
    PrismaService,
    JobsService,
    {
      provide: "CONFIG_VARIABLES",
      useFactory: async (prisma: PrismaService) => {
        return await prisma.config.findMany();
      },
      inject: [PrismaService],
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  controllers: [UserController, ShareController, FileController],
})
export class AppModule {}
