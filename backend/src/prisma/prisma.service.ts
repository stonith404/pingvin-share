import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: "file:./pingvin-share.db",
        },
      },
    });
    console.log(config.get("DB_URL"));
    super.$connect().then(() => console.info("Connected to the database"));
  }
}
