import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

const initMicroservice = async (app: INestApplication) => {
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      port: 3000,
    },
  });
  await app.startAllMicroservices();
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await initMicroservice(app);
  await app.listen(3000);
}
bootstrap();
