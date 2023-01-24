import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Share, User } from "@prisma/client";
import * as archiver from "archiver";
import * as argon from "argon2";
import * as fs from "fs";
import * as moment from "moment";
import { ClamScanService } from "src/clamscan/clamscan.service";
import { ConfigService } from "src/config/config.service";
import { EmailService } from "src/email/email.service";
import { FileService } from "src/file/file.service";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateShareDTO } from "./dto/createShare.dto";
import { ReverseShareTokenDTO } from "./dto/reverseShareToken.dto";

@Injectable()
export class ShareService {
  constructor(
    private prisma: PrismaService,
    private fileService: FileService,
    private emailService: EmailService,
    private config: ConfigService,
    private jwtService: JwtService,
    private clamScanService: ClamScanService
  ) {}

  async create(share: CreateShareDTO, user?: User, reverseShareToken?: string) {
    if (!(await this.isShareIdAvailable(share.id)).isAvailable)
      throw new BadRequestException("Share id already in use");

    if (!share.security || Object.keys(share.security).length == 0)
      share.security = undefined;

    if (share.security?.password) {
      share.security.password = await argon.hash(share.security.password);
    }

    let expirationDate: Date;

    // If share is created by a reverse share token override the expiration date
    if (reverseShareToken) {
      const { shareExpiration } =
        await this.prisma.reverseShareToken.findUnique({
          where: { id: reverseShareToken },
        });

      expirationDate = shareExpiration;
    } else {
      // We have to add an exception for "never" (since moment won't like that)
      if (share.expiration !== "never") {
        expirationDate = moment()
          .add(
            share.expiration.split("-")[0],
            share.expiration.split(
              "-"
            )[1] as moment.unitOfTime.DurationConstructor
          )
          .toDate();
      } else {
        expirationDate = moment(0).toDate();
      }
    }

    fs.mkdirSync(`./data/uploads/shares/${share.id}`, {
      recursive: true,
    });

    const shareTuple = await this.prisma.share.create({
      data: {
        ...share,
        expiration: expirationDate,
        creator: { connect: user ? { id: user.id } : undefined },
        security: { create: share.security },
        recipients: {
          create: share.recipients
            ? share.recipients.map((email) => ({ email }))
            : [],
        },
      },
    });

    if (reverseShareToken) {
      // Assign share to reverse share token
      await this.prisma.reverseShareToken.update({
        where: { id: reverseShareToken },
        data: {
          shareId: share.id,
        },
      });
    }

    return shareTuple;
  }

  async createZip(shareId: string) {
    const path = `./data/uploads/shares/${shareId}`;

    const files = await this.prisma.file.findMany({ where: { shareId } });
    const archive = archiver("zip", {
      zlib: { level: 9 },
    });
    const writeStream = fs.createWriteStream(`${path}/archive.zip`);

    for (const file of files) {
      archive.append(fs.createReadStream(`${path}/${file.id}`), {
        name: file.name,
      });
    }

    archive.pipe(writeStream);
    await archive.finalize();
  }

  async complete(id: string, reverseShareToken?: string) {
    const share = await this.prisma.share.findUnique({
      where: { id },
      include: { files: true, recipients: true, creator: true },
    });

    if (await this.isShareCompleted(id))
      throw new BadRequestException("Share already completed");

    if (share.files.length == 0)
      throw new BadRequestException(
        "You need at least on file in your share to complete it."
      );

    // Asynchronously create a zip of all files
    if (share.files.length > 1)
      this.createZip(id).then(() =>
        this.prisma.share.update({ where: { id }, data: { isZipReady: true } })
      );

    // Send email for each recepient
    for (const recepient of share.recipients) {
      await this.emailService.sendMail(
        recepient.email,
        share.id,
        share.creator
      );
    }

    // Check if any file is malicious with ClamAV
    this.clamScanService.checkAndRemove(share.id);

    if (reverseShareToken) {
      await this.prisma.reverseShareToken.update({
        where: { id: reverseShareToken },
        data: { used: true },
      });
    }

    return await this.prisma.share.update({
      where: { id },
      data: { uploadLocked: true },
    });
  }

  async getSharesByUser(userId: string) {
    const shares = await this.prisma.share.findMany({
      where: {
        creator: { id: userId },
        uploadLocked: true,
        // We want to grab any shares that are not expired or have their expiration date set to "never" (unix 0)
        OR: [
          { expiration: { gt: new Date() } },
          { expiration: { equals: moment(0).toDate() } },
        ],
      },
      orderBy: {
        expiration: "desc",
      },
      include: { recipients: true },
    });

    const sharesWithEmailRecipients = shares.map((share) => {
      return {
        ...share,
        recipients: share.recipients.map((recipients) => recipients.email),
      };
    });

    return sharesWithEmailRecipients;
  }

  async get(id: string) {
    const share = await this.prisma.share.findUnique({
      where: { id },
      include: {
        files: true,
        creator: true,
      },
    });

    if (share.removedReason)
      throw new NotFoundException(share.removedReason, "share_removed");

    if (!share || !share.uploadLocked)
      throw new NotFoundException("Share not found");

    return share as any;
  }

  async getMetaData(id: string) {
    const share = await this.prisma.share.findUnique({
      where: { id },
    });

    if (!share || !share.uploadLocked)
      throw new NotFoundException("Share not found");

    return share;
  }

  async remove(shareId: string) {
    const share = await this.prisma.share.findUnique({
      where: { id: shareId },
    });

    if (!share) throw new NotFoundException("Share not found");
    if (!share.creatorId)
      throw new ForbiddenException("Anonymous shares can't be deleted");

    await this.fileService.deleteAllFiles(shareId);
    await this.prisma.share.delete({ where: { id: shareId } });
  }

  async isShareCompleted(id: string) {
    return (await this.prisma.share.findUnique({ where: { id } })).uploadLocked;
  }

  async isShareIdAvailable(id: string) {
    const share = await this.prisma.share.findUnique({ where: { id } });
    return { isAvailable: !share };
  }

  async increaseViewCount(share: Share) {
    await this.prisma.share.update({
      where: { id: share.id },
      data: { views: share.views + 1 },
    });
  }

  async getShareToken(shareId: string, password: string) {
    const share = await this.prisma.share.findFirst({
      where: { id: shareId },
      include: {
        security: true,
      },
    });

    if (
      share?.security?.password &&
      !(await argon.verify(share.security.password, password))
    )
      throw new ForbiddenException("Wrong password");

    const token = await this.generateShareToken(shareId);
    await this.increaseViewCount(share);
    return { token };
  }

  async generateShareToken(shareId: string) {
    const { expiration } = await this.prisma.share.findUnique({
      where: { id: shareId },
    });
    return this.jwtService.sign(
      {
        shareId,
      },
      {
        expiresIn: moment(expiration).diff(new Date(), "seconds") + "s",
        secret: this.config.get("JWT_SECRET"),
      }
    );
  }

  async verifyShareToken(shareId: string, token: string) {
    const { expiration } = await this.prisma.share.findUnique({
      where: { id: shareId },
    });

    try {
      const claims = this.jwtService.verify(token, {
        secret: this.config.get("JWT_SECRET"),
        // Ignore expiration if expiration is 0
        ignoreExpiration: moment(expiration).isSame(0),
      });

      return claims.shareId == shareId;
    } catch {
      return false;
    }
  }

  async createReverseShareToken(data: ReverseShareTokenDTO, creatorId: string) {
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

  async getReverseShareToken(reverseShareToken: string) {
    const reverseShareTokenTuple =
      await this.prisma.reverseShareToken.findUnique({
        where: { id: reverseShareToken },
      });

    return reverseShareTokenTuple;
  }

  async isReverseShareTokenValid(reverseShareToken: string) {
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
