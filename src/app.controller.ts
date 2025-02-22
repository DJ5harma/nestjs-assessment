import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

// Just for helping with the server checking again
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
