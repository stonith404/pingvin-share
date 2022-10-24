import { ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";

export class JwtGuard extends AuthGuard("jwt") {
  constructor() {
    super();
  }
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    return process.env.ALLOW_UNAUTHENTICATED_SHARES == "true"
      ? true
      : super.canActivate(context);
  }
}
