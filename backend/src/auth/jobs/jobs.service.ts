import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { FileService } from "src/file/file.service";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class JobsService {
  constructor(
    private prisma: PrismaService,
    private fileService: FileService
  ) {}

  @Cron("0 * * * *")
  async deleteExpiredShares() {
    const expiredShares = await this.prisma.share.findMany({
      where: { expiration: { lt: new Date() } },
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
