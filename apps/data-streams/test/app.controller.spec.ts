import { Test, TestingModule } from '@nestjs/testing';
import { DataStreamsController } from '../src/app.controller';
import { DataStreamsService } from '../src/app.service';
import { ClientProxy } from '@nestjs/microservices';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NobelPrizesEntity } from '../src/nobel/entities/nobel.entity';

describe('Data-streams controller unit test', () => {
  let controller: DataStreamsController;
  let clientProxy: ClientProxy;

  const mockClientProxy = {
    emit: jest.fn(),
  };

  const mockDataStreamsService = {
    start: jest.fn().mockImplementation(() => {
      return mockClientProxy.emit('start_service', { interval: 300000 });
    }),
    stop: jest.fn().mockImplementation(() => {
      return mockClientProxy.emit('stop_service', {});
    }),
    fetchDataFromStorage: jest
      .fn()
      .mockImplementation(() => mockNobelService.fetchData()),
    persistData: jest
      .fn()
      .mockImplementation(async () => await mockNobelService.saveData()),
  };

  const mockNobelService = {
    fetchData: jest.fn().mockImplementation(() => {
      return Promise.resolve([
        {
          id: 1,
          name: 'William L. Holberg',
          category: 'Computer Scinece',
          awardDate: new Date(),
          awardYear: new Date().getFullYear(),
          price: 200000,
        },
      ]);
    }),
    saveData: jest.fn().mockImplementation(() => {
      return Promise.resolve({
        id: 2,
        name: 'William L. Holberg',
        category: 'Computer Scinece',
        awardDate: new Date(),
        awardYear: new Date().getFullYear(),
        price: 200000,
      });
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DataStreamsController],
      providers: [
        {
          provide: DataStreamsService,
          useValue: mockDataStreamsService,
        },
        {
          provide: 'WORKER_SERVICE',
          useValue: mockClientProxy,
        },
        {
          provide: getRepositoryToken(NobelPrizesEntity),
          useValue: {}, // I can Mock the repository if needed but since it's an isolated test ill just mock the functions
        },
      ],
    }).compile();

    controller = module.get<DataStreamsController>(DataStreamsController);
    clientProxy = module.get<ClientProxy>('WORKER_SERVICE');
  });

  it('Data-streams controller has been created', () => {
    expect(controller).toBeDefined();
  });

  it('Starts the Worker service', async () => {
    const interval = { interval: expect.any(Number) };
    controller.startWorker();
    expect(mockDataStreamsService.start).toHaveBeenCalled();
    expect(clientProxy.emit).toHaveBeenLastCalledWith(
      'start_service',
      interval,
    );
  });

  it('Stops the Worker service', () => {
    controller.stopWorker();
    expect(mockDataStreamsService.stop).toHaveBeenCalled();
    expect(mockClientProxy.emit).toHaveBeenLastCalledWith('stop_service', {});
  });

  it('Gets the persisted data', async () => {
    const returnedData = [
      {
        id: expect.any(Number),
        name: 'William L. Holberg',
        category: 'Computer Scinece',
        awardDate: expect.any(Date),
        awardYear: expect.any(Number),
        price: expect.any(Number),
      },
    ];
    const data = await controller.getData();
    expect(mockDataStreamsService.fetchDataFromStorage).toHaveBeenCalled();
    expect(data).toEqual(returnedData);
  });

  it('Persist the data recived from the worker', async () => {
    const dataDto = {
      id: 2,
      name: 'William L. Holberg',
      category: 'Computer Scinece',
      awardDate: new Date(),
      awardYear: new Date().getFullYear(),
      price: 200000,
    };

    controller.handleRecivedData(dataDto);
    const persistanceData = await mockDataStreamsService.persistData();
    expect(mockDataStreamsService.persistData).toHaveBeenCalled();
    expect(persistanceData).toEqual(dataDto);
  });
});
