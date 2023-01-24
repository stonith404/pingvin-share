import { BadRequestException, Injectable } from "@nestjs/common";
import * as moment from "moment";
import { ConfigService } from "src/config/config.service";
import { PrismaService } from "src/prisma/prisma.service";
import { ReverseShareTokenDTO } from "./dto/reverseShareToken.dto";

@Injectable()
export class ReverseShareService {
  constructor(private config: ConfigService, private prisma: PrismaService) {}

  async create(data: ReverseShareTokenDTO, creatorId: string) {
    // Parse date string to date
    const expirationDate = moment()
      .add(
        data.expiration.split("-")[0],
        data.expiration.split("-")[1] as moment.unitOfTime.DurationConstructor
      )
      .toDate();

    const globalMaxShareSize = this.config.get("MAX_SHARE_SIZE");

    if (globalMaxShareSize < data.maxShareSize)
      throw new BadRequestException(
        `Max share size can't be greater than ${globalMaxShareSize} bytes.`
      );

    const reverseShareTokenTuple = await this.prisma.reverseShareToken.create({
      data: {
        shareExpiration: expirationDate,
        maxShareSize: data.maxShareSize,
        creatorId,
      },
    });

    return reverseShareTokenTuple.id;
  }

  async get(reverseShareToken: string) {
    const reverseShareTokenTuple =
      await this.prisma.reverseShareToken.findUnique({
        where: { id: reverseShareToken },
      });

    return reverseShareTokenTuple;
  }

  async getAllByUser(userId: string) {
    const reverseShareTokens = await this.prisma.reverseShareToken.findMany({
      where: {
        creatorId: userId,

        shareExpiration: { gt: new Date() },
      },
      orderBy: {
        shareExpiration: "desc",
      },
      include: { share: { include: { recipients: true } } },
    });

    const sharesWithEmailRecipients = reverseShareTokens.map(
      (reverseShareToken) => {
        return {
          ...reverseShareToken.share,
          recipients: reverseShareToken.share.recipients.map(
            (recipients) => recipients.email
          ),
        };
      }
    );

    return sharesWithEmailRecipients;
  }

  async isValid(reverseShareToken: string) {
    const reverseShareTokenTuple =
      await this.prisma.reverseShareToken.findUnique({
        where: { id: reverseShareToken },
      });

    if (!reverseShareTokenTuple) return false;

    const isExpired = new Date() > reverseShareTokenTuple.shareExpiration;
    const isUsed = reverseShareTokenTuple.used;

    return !(isExpired || isUsed);
  }
}
