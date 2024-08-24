import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { EmailModule } from "src/email/email.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthTotpService } from "./authTotp.service";
import { JwtStrategy } from "./strategy/jwt.strategy";
import { LdapService } from "./ldap.service";
import { UserModule } from "../user/user.module";

@Module({
  imports: [
    JwtModule.register({
      global: true,
    }),
    EmailModule,
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthTotpService, JwtStrategy, LdapService],
  exports: [AuthService],
})
export class AuthModule { }
