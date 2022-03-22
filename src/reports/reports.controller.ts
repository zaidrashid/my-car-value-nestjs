import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { CreateReportDto } from './dtos/create-report-dto';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard)
  createReport(@Body() body: CreateReportDto) {
    const report = this.reportsService.create(body);
    return report;
  }
}
