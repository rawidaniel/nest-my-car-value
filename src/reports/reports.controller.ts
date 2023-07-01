import { Controller, Get, Query } from '@nestjs/common';

@Controller('reports')
export class ReportsController {
  @Get('/filed')
  getColors(@Query() param: any) {
    console.log('helloooooo');
    console.log(param.filed);
    return param.filed.split(',');
  }
}
