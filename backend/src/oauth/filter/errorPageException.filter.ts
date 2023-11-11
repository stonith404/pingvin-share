import { ArgumentsHost, Catch, ExceptionFilter, Logger } from "@nestjs/common";
import { ConfigService } from "../../config/config.service";
import { ErrorPageException } from "../exceptions/errorPage.exception";

@Catch(ErrorPageException)
export class ErrorPageExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ErrorPageExceptionFilter.name);

  constructor(private config: ConfigService) {}

  catch(exception: ErrorPageException, host: ArgumentsHost) {
    this.logger.error(exception);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const url = new URL(`${this.config.get("general.appUrl")}/error`);
    url.searchParams.set("redirect", exception.redirect);
    url.searchParams.set("error", exception.key);
    if (exception.params) {
      url.searchParams.set("params", exception.params.join(","));
    }

    response.redirect(url.toString());
  }
}
