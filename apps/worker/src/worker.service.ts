import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AxiosError } from 'axios';
import { firstValueFrom, catchError } from 'rxjs';

@Injectable()
export class WorkerService {
  private readonly logger: Logger;
  private intervalId: NodeJS.Timeout | null = null;

  constructor(
    @Inject('DATA_STREAM_SERVICE') private readonly client: ClientProxy,
    private readonly httpService: HttpService,
  ) {
    this.logger = new Logger(WorkerService.name);
  }

  async startDataFetching(intervalMs: number): Promise<any> {
    if (this.intervalId) {
      this.logger.warn(
        'startDataFetching - WorkerService: The service has already been started and is fetching for data.',
      );
      return;
    }

    this.logger.log(
      `startDataFetching - WorkerService: Start feching data, every ${intervalMs} miliseconds!`,
    );

    // pre-fenchinge since the setInterval function will make its first call when time is up
    this.client.emit(
      'new_data_fetched',
      this.dataTransformation(await this.fetchExternaleAPIData()),
    );
    this.intervalId = setInterval(async () => {
      const fetchedData = await this.fetchExternaleAPIData();
      this.client.emit(
        'new_data_fetched',
        this.dataTransformation(fetchedData),
      );
    }, intervalMs);
  }

  stopDataFetching() {
    if (this.intervalId) {
      this.logger.log(
        'startDataFetching - WorkerService: Stoping the data fetching',
      );
      clearInterval(this.intervalId);
      this.intervalId = null;
      return;
    }

    this.logger.warn(
      "startDataFetching - WorkerService: The Worker service hasn't been started yet",
    );
    return;
  }

  async fetchExternaleAPIData(): Promise<any> {
    const { data } = await firstValueFrom(
      this.httpService.get('https://api.nobelprize.org/2.1/nobelPrizes').pipe(
        catchError((error: AxiosError) => {
          this.logger.error(
            'fetchExternalAPIDATA - WorkerService: The following error occured: \n',
            error.response.data,
          );
          throw 'fetchExternalAPIDATA - WorkerService: An error occurred!';
        }),
      ),
    );
    return data;
  }

  dataTransformation(data: object): object {
    return data;
  }
}
