import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { User } from "@prisma/client";
import * as nodemailer from "nodemailer";
import { ConfigService } from "src/config/config.service";

@Injectable()
export class EmailService {
  constructor(private config: ConfigService) {}

  getTransporter() {
    if (!this.config.get("smtp.enabled"))
      throw new InternalServerErrorException("SMTP is disabled");

    return nodemailer.createTransport({
      host: this.config.get("smtp.host"),
      port: this.config.get("smtp.port"),
      secure: this.config.get("smtp.port") == 465,
      auth: {
        user: this.config.get("smtp.username"),
        pass: this.config.get("smtp.password"),
      },
    });
  }

  async sendMailToShareRecepients(
    recipientEmail: string,
    shareId: string,
    creator?: User
  ) {
    if (!this.config.get("email.enableShareEmailRecipients"))
      throw new InternalServerErrorException("Email service disabled");

    const shareUrl = `${this.config.get("general.appUrl")}/share/${shareId}`;

    await this.getTransporter().sendMail({
      from: `"${this.config.get("general.appName")}" <${this.config.get(
        "smtp.email"
      )}>`,
      to: recipientEmail,
      subject: this.config.get("email.shareRecipientsSubject"),
      text: this.config
        .get("email.shareRecipientsMessage")
        .replaceAll("\\n", "\n")
        .replaceAll("{creator}", creator?.username ?? "Someone")
        .replaceAll("{shareUrl}", shareUrl),
    });
  }

  async sendMailToReverseShareCreator(recipientEmail: string, shareId: string) {
    const shareUrl = `${this.config.get("general.appUrl")}/share/${shareId}`;

    await this.getTransporter().sendMail({
      from: `"${this.config.get("general.appName")}" <${this.config.get(
        "smtp.email"
      )}>`,
      to: recipientEmail,
      subject: this.config.get("email.reverseShareSubject"),
      text: this.config
        .get("email.reverseShareMessage")
        .replaceAll("\\n", "\n")
        .replaceAll("{shareUrl}", shareUrl),
    });
  }

  async sendResetPasswordEmail(recipientEmail: string, token: string) {
    const resetPasswordUrl = `${this.config.get(
      "general.appUrl"
    )}/auth/resetPassword/${token}`;

    await this.getTransporter().sendMail({
      from: `"${this.config.get("general.appName")}" <${this.config.get(
        "smtp.email"
      )}>`,
      to: recipientEmail,
      subject: this.config.get("email.resetPasswordSubject"),
      text: this.config
        .get("email.resetPasswordMessage")
        .replaceAll("{url}", resetPasswordUrl),
    });
  }

  async sendInviteEmail(recipientEmail: string, password: string) {
    const loginUrl = `${this.config.get("general.appUrl")}/auth/signIn`;

    await this.getTransporter().sendMail({
      from: `"${this.config.get("general.appName")}" <${this.config.get(
        "smtp.email"
      )}>`,
      to: recipientEmail,
      subject: this.config.get("email.inviteSubject"),
      text: this.config
        .get("email.inviteMessage")
        .replaceAll("{url}", loginUrl)
        .replaceAll("{password}", password),
    });
  }

  async sendTestMail(recipientEmail: string) {
    try {
      await this.getTransporter().sendMail({
      from: `"${this.config.get("general.appName")}" <${this.config.get(
        "smtp.email"
      )}>`,
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
