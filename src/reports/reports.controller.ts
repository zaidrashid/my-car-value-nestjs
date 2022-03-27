import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Serialize } from '../interceptor/serialize.interceptor';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { AuthGuard } from '../guards/auth.guard';
import { AdminGuard } from 'src/guards/admin.guard';
import { ReportsService } from './reports.service';
import {
  CreateReportDto,
  ApprovedReportDto,
  GetEstimtateDto,
  ReportDto,
} from './dtos';

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

  @Patch('/:id')
  @UseGuards(AdminGuard)
  approveReport(@Param('id') id: string, @Body() body: ApprovedReportDto) {
    return this.reportsService.changeApproval(parseInt(id), body.approved);
  }

  @Get()
  getEstimate(@Query() query: GetEstimtateDto) {
    console.log(query);
    return query;
  }
}
