import { BadRequestException, Injectable } from "@nestjs/common";
import * as moment from "moment";
import { ConfigService } from "src/config/config.service";
import { FileService } from "src/file/file.service";
import { PrismaService } from "src/prisma/prisma.service";
import { parseRelativeDateToAbsolute } from "src/utils/date.util";
import { CreateReverseShareDTO } from "./dto/createReverseShare.dto";

@Injectable()
export class ReverseShareService {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
    private fileService: FileService,
  ) {}

  async create(data: CreateReverseShareDTO, creatorId: string) {
    // Parse date string to date
    const expirationDate = moment()
      .add(
        data.shareExpiration.split("-")[0],
        data.shareExpiration.split(
          "-",
        )[1] as moment.unitOfTime.DurationConstructor,
      )
      .toDate();

    const parsedExpiration = parseRelativeDateToAbsolute(data.shareExpiration);
    if (
      this.config.get("share.maxExpiration") !== 0 &&
      parsedExpiration >
        moment().add(this.config.get("share.maxExpiration"), "hours").toDate()
    ) {
      throw new BadRequestException(
        "Expiration date exceeds maximum expiration date",
      );
    }

    const globalMaxShareSize = this.config.get("share.maxSize");

    if (globalMaxShareSize < data.maxShareSize)
      throw new BadRequestException(
        `Max share size can't be greater than ${globalMaxShareSize} bytes.`,
      );

    const reverseShare = await this.prisma.reverseShare.create({
      data: {
        shareExpiration: expirationDate,
        remainingUses: data.maxUseCount,
        maxShareSize: data.maxShareSize,
        sendEmailNotification: data.sendEmailNotification,
        creatorId,
      },
    });

    return reverseShare.token;
  }

  async getByToken(reverseShareToken?: string) {
    if (!reverseShareToken) return null;

    const reverseShare = await this.prisma.reverseShare.findUnique({
      where: { token: reverseShareToken },
    });

    return reverseShare;
  }

  async getAllByUser(userId: string) {
    const reverseShares = await this.prisma.reverseShare.findMany({
      where: {
        creatorId: userId,
        shareExpiration: { gt: new Date() },
      },
      orderBy: {
        shareExpiration: "desc",
      },
      include: { shares: { include: { creator: true } } },
    });

    return reverseShares;
  }

  async isValid(reverseShareToken: string) {
    const reverseShare = await this.prisma.reverseShare.findUnique({
      where: { token: reverseShareToken },
    });

    if (!reverseShare) return false;

    const isExpired = new Date() > reverseShare.shareExpiration;
    const remainingUsesExceeded = reverseShare.remainingUses <= 0;

    return !(isExpired || remainingUsesExceeded);
  }

  async remove(id: string) {
    const shares = await this.prisma.share.findMany({
      where: { reverseShare: { id } },
    });

    for (const share of shares) {
      await this.prisma.share.delete({ where: { id: share.id } });
      await this.fileService.deleteAllFiles(share.id);
    }

    await this.prisma.reverseShare.delete({ where: { id } });
  }
}
