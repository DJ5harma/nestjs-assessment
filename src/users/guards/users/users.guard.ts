import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

interface CustomRequest extends Request {
  user?: any;
}

const JWT_SECRET = 'dwbnnb';

@Injectable()
export class UsersGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<CustomRequest>();
    const token = request.cookies['jwt'];
    if (!token) {
      return false;
    }
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      request.user = decoded;
      return true;
    } catch (error) {
      return false;
    }
  }
}
