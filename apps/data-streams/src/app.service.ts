import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class DataStreamsService {
  intrevalId: number = 300000; // 5 min in ms

  constructor(@Inject('WORKER_SERVICE') private readonly client: ClientProxy) {}

  start() {
    return this.client.emit('start_service', { interval: this.intrevalId });
  }

  stop() {
    return this.client.emit('stop_service', {});
  }

  fetchDataFromStorage() {
    return;
  }
}
