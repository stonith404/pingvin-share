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
        user: this.config.get("SMTP_USERNAME"),
        pass: this.config.get("SMTP_PASSWORD"),
      },
    });

    if (!this.config.get("ENABLE_EMAIL_RECIPIENTS"))
      throw new InternalServerErrorException("Email service disabled");

    const shareUrl = `${this.config.get("APP_URL")}/share/${shareId}`;

    await transporter.sendMail({
      from: `"Pingvin Share" <${this.config.get("SMTP_EMAIL")}>`,
      to: recipientEmail,
      subject: "Files shared with you",
      text: `Hey!\n${creator.username} shared some files with you. View or dowload the files with this link: ${shareUrl}.\nShared securely with Pingvin Share 🐧`,
    });
  }
}
