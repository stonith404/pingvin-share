import { Injectable, Logger } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { DATABASE_URL } from "../constants";

@Injectable()
export class PrismaService extends PrismaClient {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      datasources: {
        db: {
          url: DATABASE_URL,
        },
      },
    });
    super.$connect().then(() => this.logger.log("Connected to the database"));
  }
}
