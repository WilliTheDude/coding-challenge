import { Controller, Get, Post, Logger, Body } from '@nestjs/common';
import { DataStreamsService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { NobelPrizesEntity } from './nobel/entities/nobel.entity';

@Controller()
export class DataStreamsController {
  private readonly logger: Logger;

  constructor(private readonly appService: DataStreamsService) {
    this.logger = new Logger(DataStreamsController.name);
  }

  @Post('start')
  startWorker() {
    return this.appService.start();
  }

  @Post('stop')
  stopWorker() {
    return this.appService.stop();
  }

  @Get()
  async getData(): Promise<NobelPrizesEntity[]> {
    try {
      const res = await this.appService.fetchDataFromStorage();
      this.logger.log(
        'getData - DataStreamsController: Successfully fetched the data from persistance',
      );
      this.logger.log(res);
      return res;
    } catch (e) {
      this.logger.error(
        'getData - DataStreamsController: An error occured while fetching the data',
      );
      return [];
    }
  }

  @MessagePattern('new_data_fetched')
  handleRecivedData(@Body() data) {
    try {
      this.appService.persistData(data);
      this.logger.log(
        'handleData - DataStreamsController: Sucessfully persisted data recived from worker.',
      );
    } catch (e) {
      this.logger.error(
        'handleData - DataStreamsController: An error occurred while persisting the data',
      );
    }
  }
}
