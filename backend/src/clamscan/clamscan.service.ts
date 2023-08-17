import { Injectable, Logger } from "@nestjs/common";
import * as NodeClam from "clamscan";
import * as fs from "fs";
import { FileService } from "src/file/file.service";
import { PrismaService } from "src/prisma/prisma.service";
import { CLAMAV_HOST, CLAMAV_PORT, SHARE_DIRECTORY } from "../constants";

const clamscanConfig = {
  clamdscan: {
    host: CLAMAV_HOST,
    port: CLAMAV_PORT,
    localFallback: false,
  },
  preference: "clamdscan",
};
@Injectable()
export class ClamScanService {
  private readonly logger = new Logger(ClamScanService.name);

  constructor(
    private fileService: FileService,
    private prisma: PrismaService,
  ) {}

  private ClamScan: Promise<NodeClam | null> = new NodeClam()
    .init(clamscanConfig)
    .then((res) => {
      this.logger.log("ClamAV is active");
      return res;
    })
    .catch(() => {
      this.logger.log("ClamAV is not active");
      return null;
    });

  async check(shareId: string) {
    const clamScan = await this.ClamScan;

    if (!clamScan) return [];

    const infectedFiles = [];

    const files = fs
      .readdirSync(`${SHARE_DIRECTORY}/${shareId}`)
      .filter((file) => file != "archive.zip");

    for (const fileId of files) {
      const { isInfected } = await clamScan
        .isInfected(`${SHARE_DIRECTORY}/${shareId}/${fileId}`)
        .catch(() => {
          this.logger.log("ClamAV is not active");
          return { isInfected: false };
        });

      const fileName = (
        await this.prisma.file.findUnique({ where: { id: fileId } })
      ).name;

      if (isInfected) {
        infectedFiles.push({ id: fileId, name: fileName });
      }
    }

    return infectedFiles;
  }

  async checkAndRemove(shareId: string) {
    const infectedFiles = await this.check(shareId);

    if (infectedFiles.length > 0) {
      await this.fileService.deleteAllFiles(shareId);
      await this.prisma.file.deleteMany({ where: { shareId } });

      const fileNames = infectedFiles.map((file) => file.name).join(", ");

      await this.prisma.share.update({
        where: { id: shareId },
        data: {
          removedReason: `Your share got removed because the file(s) ${fileNames} are malicious.`,
        },
      });

      this.logger.warn(
        `Share ${shareId} deleted because it contained ${infectedFiles.length} malicious file(s)`,
      );
    }
  }
}
