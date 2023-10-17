import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from "@nestjs/common";
import { ConfigService } from "../../config/config.service";

@Catch(HttpException)
export class OAuthExceptionFilter implements ExceptionFilter {
  private errorKeys: Record<string, string> = {
    access_denied: "access_denied",
    expired_token: "expired_token",
  };

  constructor(private config: ConfigService) {}

  catch(_exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const key = this.errorKeys[request.query.error] || "default";

    const url = new URL(`${this.config.get("general.appUrl")}/error`);
    url.searchParams.set("redirect", "/auth/signIn");
    url.searchParams.set("error", key);

    response.redirect(url.toString());
  }
}
