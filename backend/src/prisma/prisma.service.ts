import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      datasources: {
        db: {
          url:
            process.env.DATABASE_URL ||
            "file:../data/pingvin-share.db?connection_limit=1",
        },
      },
    });
    super.$connect().then(() => console.info("Connected to the database"));
  }
}
