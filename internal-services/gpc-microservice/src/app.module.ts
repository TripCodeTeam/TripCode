import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ComputesModule } from './computes/computes.module';
import { KubernetesModule } from './kubernetes/kubernetes.module';

@Module({
  imports: [ComputesModule, KubernetesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
