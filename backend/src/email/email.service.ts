import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { User } from "@prisma/client";
import * as nodemailer from "nodemailer";
import { ConfigService } from "src/config/config.service";

@Injectable()
export class EmailService {
  constructor(private config: ConfigService) {}

  getTransporter() {
    if (!this.config.get("SMTP_ENABLED"))
      throw new InternalServerErrorException("SMTP is disabled");

    return nodemailer.createTransport({
      host: this.config.get("SMTP_HOST"),
      port: parseInt(this.config.get("SMTP_PORT")),
      secure: parseInt(this.config.get("SMTP_PORT")) == 465,
      auth: {
        user: this.config.get("SMTP_USERNAME"),
        pass: this.config.get("SMTP_PASSWORD"),
      },
    });
  }

  async sendMailToShareRecepients(
    recipientEmail: string,
    shareId: string,
    creator?: User
  ) {
    if (!this.config.get("ENABLE_SHARE_EMAIL_RECIPIENTS"))
      throw new InternalServerErrorException("Email service disabled");

    const shareUrl = `${this.config.get("APP_URL")}/share/${shareId}`;

    await this.getTransporter().sendMail({
      from: `"Pingvin Share" <${this.config.get("SMTP_EMAIL")}>`,
      to: recipientEmail,
      subject: this.config.get("SHARE_RECEPIENTS_EMAIL_SUBJECT"),
      text: this.config
        .get("SHARE_RECEPIENTS_EMAIL_MESSAGE")
        .replaceAll("\\n", "\n")
        .replaceAll("{creator}", creator?.username ?? "Someone")
        .replaceAll("{shareUrl}", shareUrl),
    });
  }

  async sendMailToReverseShareCreator(recipientEmail: string, shareId: string) {
    const shareUrl = `${this.config.get("APP_URL")}/share/${shareId}`;

    await this.getTransporter().sendMail({
      from: `"Pingvin Share" <${this.config.get("SMTP_EMAIL")}>`,
      to: recipientEmail,
      subject: this.config.get("REVERSE_SHARE_EMAIL_SUBJECT"),
      text: this.config
        .get("REVERSE_SHARE_EMAIL_MESSAGE")
        .replaceAll("\\n", "\n")
        .replaceAll("{shareUrl}", shareUrl),
    });
  }

  async sendResetPasswordEmail(recipientEmail: string, token: string) {
    const resetPasswordUrl = `${this.config.get(
      "APP_URL"
    )}/auth/resetPassword/${token}`;

    await this.getTransporter().sendMail({
      from: `"Pingvin Share" <${this.config.get("SMTP_EMAIL")}>`,
      to: recipientEmail,
      subject: this.config.get("RESET_PASSWORD_EMAIL_SUBJECT"),
      text: this.config
        .get("RESET_PASSWORD_EMAIL_MESSAGE")
        .replaceAll("{url}", resetPasswordUrl),
    });
  }

  async sendTestMail(recipientEmail: string) {
    try {
      await this.getTransporter().sendMail({
        from: `"Pingvin Share" <${this.config.get("SMTP_EMAIL")}>`,
        to: recipientEmail,
        subject: "Test email",
        text: "This is a test email",
      });
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException(e.message);
    }
  }
}
