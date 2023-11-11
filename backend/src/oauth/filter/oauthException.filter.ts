import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from "@nestjs/common";
import { ConfigService } from "../../config/config.service";

@Catch(HttpException)
export class OAuthExceptionFilter implements ExceptionFilter {
  private errorKeys: Record<string, string> = {
    access_denied: "access_denied",
    expired_token: "expired_token",
  };
  private readonly logger = new Logger(OAuthExceptionFilter.name);

  constructor(private config: ConfigService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    this.logger.error(exception.message);
    this.logger.error(
      "Request query: " + JSON.stringify(request.query, null, 2),
    );

    const key = this.errorKeys[request.query.error] || "default";

    const url = new URL(`${this.config.get("general.appUrl")}/error`);
    url.searchParams.set("redirect", "/account");
    url.searchParams.set("error", key);

    response.redirect(url.toString());
  }
}
