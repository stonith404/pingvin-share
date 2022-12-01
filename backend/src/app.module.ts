import { HttpException, HttpStatus, Module } from "@nestjs/common";

import { ScheduleModule } from "@nestjs/schedule";
import { AuthModule } from "./auth/auth.module";
import { JobsService } from "./jobs/jobs.service";

import { APP_GUARD } from "@nestjs/core";
import { MulterModule } from "@nestjs/platform-express";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { Request } from "express";
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
    MulterModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        fileFilter: (req: Request, file, cb) => {
          const maxFileSize = config.get("maxFileSize");
          const requestFileSize = parseInt(req.headers["content-length"]);
          const isValidFileSize = requestFileSize <= maxFileSize;
          cb(
            !isValidFileSize &&
              new HttpException(
                `File must be smaller than ${maxFileSize} bytes`,
                HttpStatus.PAYLOAD_TOO_LARGE
              ),
            isValidFileSize
          );
        },
      }),
      inject: [ConfigService],
    }),
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
