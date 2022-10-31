import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: "file:../data/pingvin-share.db",
        },
      },
    });
    super.$connect().then(() => console.info("Connected to the database"));
  }
}
