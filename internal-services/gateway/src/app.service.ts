import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(
    @Inject('CONTACTSHIP_SERVICE')
    private readonly contactship: ClientProxy,
  ) {}

  getHello() {
    return this.contactship.send({ cmd: 'hello_world' }, {});
  }
}
