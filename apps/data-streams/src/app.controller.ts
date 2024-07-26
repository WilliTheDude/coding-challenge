import { Controller, Get, Post, Logger } from '@nestjs/common';
import { DataStreamsService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { Observable } from 'rxjs';

/**
 * The serivce should communicate with the worker service and act like an entry point for that service too
 *
 * The Controller has the following endpoints:
 *
 * (Post) start: This endpoint will send a command to the Worker service telling it that it should start fetching data
 *    From the extrenal API, with a specified interval. In this case this will be every 5 minutes, but it will be a variable
 *    so it can be easily changed in the fucture if needed
 *
 * (Post) stop: This endpoint will send a command to the Worker service telling it that it should stop fetching data
 *
 * (Get) getData: This endpoint will retrive the stored data that this service has recived from the Worker service
 */

@Controller()
export class DataStreamsController {
  private readonly logger: Logger;

  constructor(private readonly appService: DataStreamsService) {
    this.logger = new Logger(DataStreamsController.name);
  }

  @Post('start')
  startWorker(): Observable<any> {
    return this.appService.start();
  }

  @Post('stop')
  stopWorker(): Observable<any> {
    return this.appService.stop();
  }

  @Get()
  getData() {
    this.logger.log('getData - DataStreamsController: Fetching persisted data');
    try {
      this.appService.fetchDataFromStorage();
      this.logger.log(
        'getData - DataStreamsController: Successfully fetched persisted data',
      );
    } catch (e) {
      this.logger.error(
        'getData - DataStreamsController: An error occured while fetching the data',
      );
    }
  }

  @MessagePattern('new_data_fetched')
  handleRecivedData() {
    this.logger.log('handleData - DataStreamsController: Persiting new data');
    try {
      this.appService.persistData();
      this.logger.log(
        'handleData - DataStreamsController: Successfully persisted the data',
      );
    } catch (e) {
      this.logger.error(
        'handleData - DataStreamsController: An error occurred while persisting the data',
      );
    }
  }
}
