import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './report.entity';
import { CreateReportDto } from './dtos/createReport.dto';
import { User } from 'src/users/user.entity';
import { GetEstimateDto } from './dtos/getEstimate.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private repoReport: Repository<Report>,
  ) {}

  createEstimate({ make, model, year, lat, lng, mileage }: GetEstimateDto) {
    return this.repoReport
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make=:make', { make })
      .andWhere('model = :model', { model })
      .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
      .andWhere('year - :year BETWEEN -3 AND 3', { year })
      .andWhere('approved IS TRUE')
      .orderBy('ABS(mileage - :mileage)', 'DESC')
      .setParameters({ mileage })
      .limit(3)
      .getRawOne();
  }

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
