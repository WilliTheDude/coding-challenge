import { Controller, Body } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class WorkerController {
  constructor(private readonly workerService: WorkerService) {}

  @MessagePattern('start_service')
  startService(@Body('interval') interval) {
    return this.workerService.startDataFetching(interval);
  }

  @MessagePattern('stop_service')
  stopService() {
    return this.workerService.stopDataFetching();
  }
}
