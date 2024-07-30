import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NobelController } from './nobel.controller';
import { NobelService } from './nobel.service';
import { NobelPrizesEntity } from './entities/nobel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NobelPrizesEntity])],
  providers: [NobelService],
  controllers: [NobelController],
  exports: [NobelService],
})
export class NobelModule {}
