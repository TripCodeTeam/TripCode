import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ComputesModule } from './computes/computes.module';
import { KubernetesModule } from './kubernetes/kubernetes.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ComputesModule,
    KubernetesModule,
    ConfigModule.forRoot({ isGlobal: true })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
