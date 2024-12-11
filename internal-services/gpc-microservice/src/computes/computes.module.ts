import { Module } from '@nestjs/common';
import { ComputesService } from './computes.service';
import { ComputeController } from './computes.controller';

@Module({
  controllers: [ComputeController],
  providers: [ComputesService],
})
export class ComputesModule {}
