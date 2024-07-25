import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class DataStreamsService {
  constructor(@Inject('WORKER_SERVICE') private readonly client: ClientProxy) {}

  // TODO: Consider if this should be a send for a requst-resposne type patteren
  start() {
    return this.client.emit('start_service', {});
  }

  // TODO: The same as above
  stop() {
    return this.client.emit('stop_service', {});
  }

  fetchDataFromStorage() {
    return;
  }
}
