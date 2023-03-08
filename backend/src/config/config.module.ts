import { Global, Module } from "@nestjs/common";
import { EmailModule } from "src/email/email.module";
import { PrismaService } from "src/prisma/prisma.service";
import { ConfigController } from "./config.controller";
import { ConfigService } from "./config.service";
import { LogoService } from "./logo.service";

@Global()
@Module({
  imports: [EmailModule],
  providers: [
    {
      provide: "CONFIG_VARIABLES",
      useFactory: async (prisma: PrismaService) => {
        return await prisma.config.findMany();
      },
      inject: [PrismaService],
    },
    ConfigService,
    LogoService,
  ],
  controllers: [ConfigController],
  exports: [ConfigService],
})
export class ConfigModule {}
