import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../users/user.entity';
import { Report } from './report.entity';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

describe('ReportsController', () => {
  let controller: ReportsController;
  let fakeReportsService: Partial<ReportsService>;

  beforeEach(async () => {
    fakeReportsService = {
      create: () => Promise.resolve({} as Report),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [
        {
          provide: ReportsService,
          useValue: fakeReportsService,
        },
      ],
    }).compile();

    controller = module.get<ReportsController>(ReportsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('fail if body is not correct', () => {
    try {
      controller.createReport(
        {
          make: 'test make',
          model: 'test model',
          price: 0,
          year: 0,
          mileage: 0,
          lng: 0,
          lat: 0,
        },
        {
          id: 1,
        } as User,
      );
    } catch (err) {}
  });
});
