import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Serialize } from '../interceptor/serialize.interceptor';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { AuthGuard } from '../guards/auth.guard';
import { CreateReportDto } from './dtos/create-report-dto';
import { ReportDto } from './dtos/report-dto';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    const report = this.reportsService.create(body, user);
    return report;
  }
}
