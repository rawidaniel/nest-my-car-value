import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    // console.log(request.session, request.currentUser);

    if (!request.currentUser) {
      // throw new UnauthorizedException('you are not logged in..........');
      return false;
    }
    return request.currentUser.admin;
  }
}
