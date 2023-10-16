import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { ConfigService } from "../../config/config.service";


@Catch(HttpException)
export class OAuthExceptionFilter implements ExceptionFilter {

  private messages: Record<string, string> = {
    "access_denied": "access_denied",
  };

  constructor(private config: ConfigService) {
  }

  catch(_exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const msg = this.messages[request.query.error] || "default";
    response.redirect(this.config.get("general.appUrl") + `/error?msg=${msg}&redirect=/auth/signIn`);
  }
}