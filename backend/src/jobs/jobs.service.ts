import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { FileService } from "src/file/file.service";
import { PrismaService } from "src/prisma/prisma.service";
import * as moment from "moment";

@Injectable()
export class JobsService {
  constructor(
    private prisma: PrismaService,
    private fileService: FileService
  ) {}

  @Cron("0 * * * *")
  async deleteExpiredShares() {
    const expiredShares = await this.prisma.share.findMany({
      where: {
        // We want to remove only shares that have an expiration date less than the current date, but not 0
        AND: [
          { expiration: { lt: new Date() } },
          { expiration: { not: moment(0).toDate() } },
        ],
      },
    });

    for (const expiredShare of expiredShares) {
      await this.prisma.share.delete({
        where: { id: expiredShare.id },
      });

      await this.fileService.deleteAllFiles(expiredShare.id);
    }

    console.log(`job: deleted ${expiredShares.length} expired shares`);
  }

  @Cron("0 * * * *")
  async deleteExpiredRefreshTokens() {
    const expiredShares = await this.prisma.refreshToken.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
    console.log(`job: deleted ${expiredShares.count} expired refresh tokens`);
  }
}
