import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NobelService } from './nobel/nobel.service';
import { NobelPrizesEntity } from './nobel/entities/nobel.entity';

@Injectable()
export class DataStreamsService {
  intrevalId: number = 300000; // 5 min in ms

  constructor(
    @Inject('WORKER_SERVICE') private readonly client: ClientProxy,
    private readonly nobelService: NobelService,
  ) {}

  start() {
    return this.client.emit('start_service', { interval: this.intrevalId });
  }

  stop() {
    return this.client.emit('stop_service', {});
  }

  async fetchDataFromStorage() {
    const retrivedData = await this.nobelService.findall();
    return retrivedData;
  }

  persistData(data: object) {
    const nobelPrizesObj = data['nobelPrizes'][0];
    const nobelPrize = new NobelPrizesEntity();
    nobelPrize.name = nobelPrizesObj['laureates'][0]['knownName']['en'] ?? '';
    nobelPrize.category = nobelPrizesObj['category']['en'] ?? '';
    nobelPrize.awardDate = new Date(nobelPrizesObj['dateAwarded']) ?? null;
    nobelPrize.awardYear = nobelPrizesObj['awardYear'] ?? '';
    nobelPrize.price = nobelPrizesObj['prizeAmount'] ?? 0;
    this.nobelService.saveData(nobelPrize);
  }
}
