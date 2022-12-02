import { HttpException, HttpStatus, Module } from "@nestjs/common";

import { ScheduleModule } from "@nestjs/schedule";
import { AuthModule } from "./auth/auth.module";

import { MulterModule } from "@nestjs/platform-express";
import { ThrottlerModule } from "@nestjs/throttler";
import { Request } from "express";
import { ConfigModule } from "./config/config.module";
import { ConfigService } from "./config/config.service";
import { EmailModule } from "./email/email.module";
import { FileModule } from "./file/file.module";
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
    UserModule,
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
})
export class AppModule {}
