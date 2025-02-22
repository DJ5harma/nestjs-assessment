import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

// Custom request object to include a user
interface CustomRequest extends Request {
  user?: any;
}

// Secret key for JWT
export const JWT_SECRET = 'dwbnnb';

@Injectable()
export class UsersGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // Get the request object from the context
    const request = context.switchToHttp().getRequest<CustomRequest>();

    // Get the token from the request cookies
    const token = request.cookies?.jwt;

    if (!token) return false;

    try {
      // decode the token to get the user id and store it in the request object

      const decoded = jwt.verify(token, JWT_SECRET);

      request.user = decoded;

      return true;
    } catch (error) {
      // If the token is invalid, return false
      return false;
    }
  }
}
