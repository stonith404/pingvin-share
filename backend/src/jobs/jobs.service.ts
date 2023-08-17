import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import * as fs from "fs";
import * as moment from "moment";
import { FileService } from "src/file/file.service";
import { PrismaService } from "src/prisma/prisma.service";
import { ReverseShareService } from "src/reverseShare/reverseShare.service";
import { SHARE_DIRECTORY } from "../constants";

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);

  constructor(
    private prisma: PrismaService,
    private reverseShareService: ReverseShareService,
    private fileService: FileService,
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

    if (expiredShares.length > 0) {
      this.logger.log(`Deleted ${expiredShares.length} expired shares`);
    }
  }

  @Cron("0 * * * *")
  async deleteExpiredReverseShares() {
    const expiredReverseShares = await this.prisma.reverseShare.findMany({
      where: {
        shareExpiration: { lt: new Date() },
      },
    });

    for (const expiredReverseShare of expiredReverseShares) {
      await this.reverseShareService.remove(expiredReverseShare.id);
    }

    if (expiredReverseShares.length > 0) {
      this.logger.log(
        `Deleted ${expiredReverseShares.length} expired reverse shares`,
      );
    }
  }

  @Cron("0 0 * * *")
  deleteTemporaryFiles() {
    let filesDeleted = 0;

    const shareDirectories = fs
      .readdirSync(SHARE_DIRECTORY, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    for (const shareDirectory of shareDirectories) {
      const temporaryFiles = fs
        .readdirSync(`${SHARE_DIRECTORY}/${shareDirectory}`)
        .filter((file) => file.endsWith(".tmp-chunk"));

      for (const file of temporaryFiles) {
        const stats = fs.statSync(
          `${SHARE_DIRECTORY}/${shareDirectory}/${file}`,
        );
        const isOlderThanOneDay = moment(stats.mtime)
          .add(1, "day")
          .isBefore(moment());

        if (isOlderThanOneDay) {
          fs.rmSync(`${SHARE_DIRECTORY}/${shareDirectory}/${file}`);
          filesDeleted++;
        }
      }
    }

    this.logger.log(`Deleted ${filesDeleted} temporary files`);
  }

  @Cron("0 * * * *")
  async deleteExpiredTokens() {
    const { count: refreshTokenCount } =
      await this.prisma.refreshToken.deleteMany({
        where: { expiresAt: { lt: new Date() } },
      });

    const { count: loginTokenCount } = await this.prisma.loginToken.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });

    const { count: resetPasswordTokenCount } =
      await this.prisma.resetPasswordToken.deleteMany({
        where: { expiresAt: { lt: new Date() } },
      });

    const deletedTokensCount =
      refreshTokenCount + loginTokenCount + resetPasswordTokenCount;

    if (deletedTokensCount > 0) {
      this.logger.log(`Deleted ${deletedTokensCount} expired refresh tokens`);
    }
  }
}
