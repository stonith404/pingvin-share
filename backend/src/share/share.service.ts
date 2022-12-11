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
import { ConfigService } from "src/config/config.service";
import { EmailService } from "src/email/email.service";
import { FileService } from "src/file/file.service";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateShareDTO } from "./dto/createShare.dto";

@Injectable()
export class ShareService {
  constructor(
    private prisma: PrismaService,
    private fileService: FileService,
    private emailService: EmailService,
    private config: ConfigService,
    private jwtService: JwtService
  ) {}

  async create(share: CreateShareDTO, user?: User) {
    if (!(await this.isShareIdAvailable(share.id)).isAvailable)
      throw new BadRequestException("Share id already in use");

    if (!share.security || Object.keys(share.security).length == 0)
      share.security = undefined;

    if (share.security?.password) {
      share.security.password = await argon.hash(share.security.password);
    }

    // We have to add an exception for "never" (since moment won't like that)
    let expirationDate: Date;
    if (share.expiration !== "never") {
      expirationDate = moment()
        .add(
          share.expiration.split("-")[0],
          share.expiration.split(
            "-"
          )[1] as moment.unitOfTime.DurationConstructor
        )
        .toDate();

      // Throw error if expiration date is now
      if (expirationDate.setMilliseconds(0) == new Date().setMilliseconds(0))
        throw new BadRequestException("Invalid expiration date");
    } else {
      expirationDate = moment(0).toDate();
    }

    return await this.prisma.share.create({
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

  async complete(id: string) {
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
    const share: any = await this.prisma.share.findUnique({
      where: { id },
      include: {
        files: true,
        creator: true,
      },
    });

    if (!share || !share.uploadLocked)
      throw new NotFoundException("Share not found");

    return share;
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
}
