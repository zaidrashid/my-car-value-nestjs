import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { Report } from './report.entity';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  async create(reportDto: CreateReportDto, user: User) {
    const report = this.repo.create(reportDto);
    report.user = user;
    return this.repo.save(report);
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }
    return this.repo.findOne({ id });
  }

  async changeApproval(id: number, approved: boolean) {
    const report = await this.findOne(id);
    if (!report) {
      throw new NotFoundException('report not found');
    }

    report.approved = approved;
    return this.repo.save(report);
  }
}
