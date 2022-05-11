import { Injectable } from '@nestjs/common';

@Injectable()
export class BoomoneyService {
  getHello(): string {
    return 'Hello World!';
  }
}
