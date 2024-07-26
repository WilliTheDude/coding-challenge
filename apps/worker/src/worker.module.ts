import { Module } from '@nestjs/common';
import { WorkerController } from './worker.controller';
import { WorkerService } from './worker.service';
import { HttpModule } from '@nestjs/axios';
import { HttpModuleConfiguration } from './configs/httpModuleConfig';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    HttpModule.registerAsync({
      useClass: HttpModuleConfiguration,
    }),
    ClientsModule.register([
      {
        name: 'DATA_STREAM_SERVICE',
        transport: Transport.TCP,
        options: {
          port: 3000,
        },
      },
    ]),
  ],
  controllers: [WorkerController],
  providers: [WorkerService],
})
export class WorkerModule {}
