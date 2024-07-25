import { Controller } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class WorkerController {
  constructor(private readonly workerService: WorkerService) {}

  @MessagePattern('start_service')
  startService() {
    console.log('startService - WORKER_SERVICE: Startede fetching the data');
    return;
  }

  @MessagePattern('stop_service')
  stopService() {
    console.log(
      'stopService - WORKER_SERVICE: stoped fetching data from external API',
    );
    return;
  }
}
