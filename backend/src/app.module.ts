import { HttpException, HttpStatus, Module } from "@nestjs/common";

import { ScheduleModule } from "@nestjs/schedule";
import { AuthModule } from "./auth/auth.module";

import { APP_GUARD } from "@nestjs/core";
import { MulterModule } from "@nestjs/platform-express";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { Request } from "express";
import { ConfigModule } from "./config/config.module";
import { ConfigService } from "./config/config.service";
import { EmailModule } from "./email/email.module";
import { FileModule } from "./file/file.module";
import { JobsModule } from "./jobs/jobs.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ShareModule } from "./share/share.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    AuthModule,
    ShareModule,
    FileModule,
    EmailModule,
    PrismaModule,
    ConfigModule,
    JobsModule,
    UserModule,
    MulterModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        fileFilter: (req: Request, file, cb) => {
          const MAX_FILE_SIZE = config.get("MAX_FILE_SIZE");
          const requestFileSize = parseInt(req.headers["content-length"]);
          const isValidFileSize = requestFileSize <= MAX_FILE_SIZE;
          cb(
            !isValidFileSize &&
              new HttpException(
                `File must be smaller than ${MAX_FILE_SIZE} bytes`,
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
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
