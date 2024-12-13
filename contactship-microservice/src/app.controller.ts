import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { CallStartingType } from 'src/types/startship';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'start-call' })
  handleStartCall(data: CallStartingType) {
    return this.appService.startCall(data);
  }

  @MessagePattern({ cmd: 'hello_world' })
  helloWorld() {
    return this.appService.getHello();
  }
}
