import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NobelPrizesEntity } from './entities/nobel.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NobelService {
  constructor(
    @InjectRepository(NobelPrizesEntity)
    private nobelRepository: Repository<NobelPrizesEntity>,
  ) {}

  async findall(): Promise<NobelPrizesEntity[]> {
    return await this.nobelRepository.find();
  }

  async saveData(nobelPrize: NobelPrizesEntity): Promise<any> {
    return await this.nobelRepository.save(nobelPrize);
  }
}
