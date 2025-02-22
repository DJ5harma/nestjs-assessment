import { Injectable } from '@nestjs/common';

// For now, just being a used to check whether the app is running

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
