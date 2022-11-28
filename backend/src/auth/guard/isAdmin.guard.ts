import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { User } from "@prisma/client";

@Injectable()
export class AdministratorGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { user }: { user: User } = context.switchToHttp().getRequest();
    if (!user) return false;
    return user.isAdministrator;
  }
}
