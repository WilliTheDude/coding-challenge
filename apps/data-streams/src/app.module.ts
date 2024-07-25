import { Module } from '@nestjs/common';
import { DataStreamsController } from './app.controller';
import { DataStreamsService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'WORKER_SERVICE',
        transport: Transport.TCP,
        options: {
          port: 3001,
        },
      },
    ]),
  ],
  controllers: [DataStreamsController],
  providers: [DataStreamsService],
})
export class AppModule {}
