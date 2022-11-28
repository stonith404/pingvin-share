import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { User } from "@prisma/client";
import * as nodemailer from "nodemailer";
import { ConfigService } from "src/config/config.service";

@Injectable()
export class EmailService {
  constructor(private config: ConfigService) {}

  async sendMail(recipientEmail: string, shareId: string, creator: User) {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: this.config.get("SMTP_HOST"),
      port: parseInt(this.config.get("SMTP_PORT")),
      secure: parseInt(this.config.get("SMTP_PORT")) == 465,
      auth: {
        user: this.config.get("SMTP_EMAIL"),
        pass: this.config.get("SMTP_PASSWORD"),
      },
    });

    if (!this.config.get("emailRecepientsEnabled"))
      throw new InternalServerErrorException("Email service disabled");

    const shareUrl = `${this.config.get("APP_URL")}/share/${shareId}`;
    const creatorIdentifier = creator
      ? creator.firstName && creator.lastName
        ? `${creator.firstName} ${creator.lastName}`
        : creator.email
      : "A Pingvin Share user";

    await transporter.sendMail({
      from: `"Pingvin Share" <${this.config.get("SMTP_EMAIL")}>`,
      to: recipientEmail,
      subject: "Files shared with you",
      text: `Hey!\n${creatorIdentifier} shared some files with you. View or dowload the files with this link: ${shareUrl}.\n Shared securely with Pingvin Share 🐧`,
    });
  }
}
