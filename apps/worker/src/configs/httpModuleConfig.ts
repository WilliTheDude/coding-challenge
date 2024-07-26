import { HttpModuleOptions, HttpModuleOptionsFactory } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

/**
 * This class should just function as a configuration calss for the Axios library.
 */

@Injectable()
export class HttpModuleConfiguration implements HttpModuleOptionsFactory {
  createHttpOptions(): Promise<HttpModuleOptions> | HttpModuleOptions {
    return {
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }
}
