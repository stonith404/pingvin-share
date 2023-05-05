import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { DATABASE_URL } from "../constants";

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      datasources: {
        db: {
          url: DATABASE_URL,
        },
      },
    });
    super.$connect().then(() => console.info("Connected to the database"));
  }
}
