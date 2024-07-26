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
    // TODO: Implement the functionality to fetch the data from the persistance storage
    return;
  }

  persistData() {
    // TODO: Implement the functionality to persist the data recived from worker microservice
    return;
  }
}
