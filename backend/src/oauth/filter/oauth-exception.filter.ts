import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from "@nestjs/common";
import { ConfigService } from "../../config/config.service";

@Catch(HttpException)
export class OAuthExceptionFilter implements ExceptionFilter {
  private messages: Record<string, string> = {
    access_denied: "access_denied",
  };

  constructor(private config: ConfigService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const knownError = this.messages[request.query.error];
    const unknownError = (exception.getResponse() as any).message;

    const url = new URL(`${this.config.get("general.appUrl")}/error`);
    url.searchParams.set("redirect", "/auth/signIn");

    if (unknownError || knownError) {
      const msg = knownError ? `error.msg.${knownError}` : unknownError;
      url.searchParams.set("msg", msg);
    }

    response.redirect(url.toString());
  }
}
