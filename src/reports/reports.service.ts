import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './report.entity';
import { CreateReportDto } from './dtos/createReport.dto';
import { User } from 'src/users/user.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private repoReport: Repository<Report>,
  ) {}

  create(reportDto: CreateReportDto, user: User) {
    const report = this.repoReport.create(reportDto);
    report.user = user;

    return this.repoReport.save(report);
  }

  findOne(id: number) {
    return this.repoReport.findOne({ where: { id } });
  }

  async changeApproval(id: number, approved: boolean) {
    const report = await this.findOne(id);

    if (!report) {
      throw new NotFoundException('report not found');
    }

    report.approved = approved;
    return this.repoReport.save(report);
  }
}
