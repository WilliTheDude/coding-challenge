import { Module } from '@nestjs/common';
import { DataStreamsController } from './app.controller';
import { DataStreamsService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NobelPrizesEntity } from './nobel/entities/nobel.entity';
import { NobelModule } from './nobel/nobel.module';

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
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'admin',
      database: 'dwhCodingInterview',
      entities: [NobelPrizesEntity],
      synchronize: true, // Set to false before final push to make it production friendly
      logging: true,
      dropSchema: true,
    }),
    NobelModule,
  ],
  controllers: [DataStreamsController],
  providers: [DataStreamsService],
})
export class AppModule {}
