import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import * as argon from "argon2";
import * as crypto from "crypto";
import { EmailService } from "src/email/email.service";
import { PrismaService } from "src/prisma/prisma.service";
import { FileService } from "../file/file.service";
import { CreateUserDTO } from "./dto/createUser.dto";
import { UpdateUserDto } from "./dto/updateUser.dto";
import { ConfigService } from "../config/config.service";
import { Entry } from "ldapts";

@Injectable()
export class UserSevice {
  private readonly logger = new Logger(UserSevice.name);

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private fileService: FileService,
    private configService: ConfigService,
  ) { }

  async list() {
    return await this.prisma.user.findMany();
  }

  async get(id: string) {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async create(dto: CreateUserDTO) {
    let hash: string;

    // The password can be undefined if the user is invited by an admin
    if (!dto.password) {
      const randomPassword = crypto.randomUUID();
      hash = await argon.hash(randomPassword);
      await this.emailService.sendInviteEmail(dto.email, randomPassword);
    } else {
      hash = await argon.hash(dto.password);
    }

    try {
      return await this.prisma.user.create({
        data: {
          ...dto,
          password: hash,
        },
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code == "P2002") {
          const duplicatedField: string = e.meta.target[0];
          throw new BadRequestException(
            `A user with this ${duplicatedField} already exists`,
          );
        }
      }
    }
  }

  async update(id: string, user: UpdateUserDto) {
    try {
      const hash = user.password && (await argon.hash(user.password));

      return await this.prisma.user.update({
        where: { id },
        data: { ...user, password: hash },
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code == "P2002") {
          const duplicatedField: string = e.meta.target[0];
          throw new BadRequestException(
            `A user with this ${duplicatedField} already exists`,
          );
        }
      }
    }
  }

  async delete(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { shares: true },
    });
    if (!user) throw new BadRequestException("User not found");

    await Promise.all(
      user.shares.map((share) => this.fileService.deleteAllFiles(share.id)),
    );

    return await this.prisma.user.delete({ where: { id } });
  }

  async findOrCreateFromLDAP(username: string, ldapEntry: Entry) {
    const fieldNameMemberOf = this.configService.get("ldap.fieldNameMemberOf");
    const fieldNameEmail = this.configService.get("ldap.fieldNameEmail");

    let isAdmin = false;
    if (fieldNameMemberOf in ldapEntry) {
      const adminGroup = this.configService.get("ldap.adminGroups");
      const entryGroups = Array.isArray(ldapEntry[fieldNameMemberOf]) ? ldapEntry[fieldNameMemberOf] : [ldapEntry[fieldNameMemberOf]];
      isAdmin = entryGroups.includes(adminGroup) ?? false;
    } else {
      this.logger.warn(`Trying to create/update a ldap user but the member field ${fieldNameMemberOf} is not present.`);
    }

    let userEmail = `${crypto.randomUUID()}@ldap.local`;
    if (fieldNameEmail in ldapEntry) {
      const value = Array.isArray(ldapEntry[fieldNameEmail]) ? ldapEntry[fieldNameEmail][0] : ldapEntry[fieldNameEmail];
      userEmail = value.toString();
    } else {
      this.logger.warn(`Trying to create/update a ldap user but the email field ${fieldNameEmail} is not present.`);
    }

    try {
      return await this.prisma.user.upsert({
        create: {
          username,
          email: userEmail,
          password: await argon.hash(crypto.randomUUID()),
          isAdmin,
          ldapDN: ldapEntry.dn,
        },
        update: {
          username,
          email: userEmail,

          isAdmin,
          ldapDN: ldapEntry.dn,
        },
        where: {
          ldapDN: ldapEntry.dn,
        },
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code == "P2002") {
          const duplicatedField: string = e.meta.target[0];
          throw new BadRequestException(
            `A user with this ${duplicatedField} already exists`,
          );
        }
      }
    }
  }
}
