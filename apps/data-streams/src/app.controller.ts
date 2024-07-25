import { Controller, Get, Post, Inject } from '@nestjs/common';
import { DataStreamsService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';
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
  constructor(private readonly appService: DataStreamsService) {}

  @Post('start')
  startWorker(): Observable<any> {
    console.log('Recived the request to start worker');
    return this.appService.start();
  }

  @Post('stop')
  stopWorker(): Observable<any> {
    console.log('reviced the request to stop the worker services');
    return this.appService.stop();
  }
}
