import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { EmailModule } from "src/email/email.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthTotpService } from "./authTotp.service";
import { JwtStrategy } from "./strategy/jwt.strategy";

@Module({
  imports: [
    JwtModule.register({
      global: true,
    }),
    EmailModule
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthTotpService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
