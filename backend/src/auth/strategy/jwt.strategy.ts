import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { User } from "@prisma/client";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "src/config/config.service";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService, private prisma: PrismaService) {
    console.log(config.get("jwtSecret"));
    config.get("jwtSecret");
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey:  config.get("jwtSecret"),
    });
  }

  async validate(payload: { sub: string }) {
    console.log("vali");
    const user: User = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });
    console.log({ user });
    return user;
  }
}
