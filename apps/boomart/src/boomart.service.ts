import { Injectable } from '@nestjs/common';

@Injectable()
export class BoomartService {
  getHello(): string {
    return 'Hello World!';
  }
}
