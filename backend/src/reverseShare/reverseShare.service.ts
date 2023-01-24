import { BadRequestException, Injectable } from "@nestjs/common";
import * as moment from "moment";
import { ConfigService } from "src/config/config.service";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateReverseShareDTO } from "./dto/createReverseShare.dto";

@Injectable()
export class ReverseShareService {
  constructor(private config: ConfigService, private prisma: PrismaService) {}

  async create(data: CreateReverseShareDTO, creatorId: string) {
    // Parse date string to date
    const expirationDate = moment()
      .add(
        data.shareExpiration.split("-")[0],
        data.shareExpiration.split(
          "-"
        )[1] as moment.unitOfTime.DurationConstructor
      )
      .toDate();

    const globalMaxShareSize = this.config.get("MAX_SHARE_SIZE");

    if (globalMaxShareSize < data.maxShareSize)
      throw new BadRequestException(
        `Max share size can't be greater than ${globalMaxShareSize} bytes.`
      );

    const reverseShare = await this.prisma.reverseShare.create({
      data: {
        shareExpiration: expirationDate,
        maxShareSize: data.maxShareSize,
        creatorId,
      },
    });

    return reverseShare.token;
  }

  async getByToken(reverseShareToken: string) {
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
      include: { share: { include: { creator: true } } },
    });

    return reverseShares;
  }

  async isValid(reverseShareToken: string) {
    const reverseShare = await this.prisma.reverseShare.findUnique({
      where: { token: reverseShareToken },
    });

    if (!reverseShare) return false;

    const isExpired = new Date() > reverseShare.shareExpiration;
    const isUsed = reverseShare.used;

    return !(isExpired || isUsed);
  }

  async remove(id: string) {
    await this.prisma.reverseShare.delete({
      where: { id },
    });
  }
}
