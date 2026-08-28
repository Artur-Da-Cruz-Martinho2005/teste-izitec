import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
@Injectable()
export class PortalGuard implements CanActivate {
  constructor(private readonly portal: string) {}
  canActivate(ctx: ExecutionContext) {
    const u = ctx.switchToHttp().getRequest().user;
    if (!u || u.portal !== this.portal)
      throw new ForbiddenException("Acesso não permitido para este portal");
    return true;
  }
}
