import { Expose, Transform } from 'class-transformer';

export class ReportDto {
  @Expose()
  id: number;

  @Expose()
  price: number;

  @Expose()
  approved: boolean;

  @Expose()
  lat: number;

  @Expose()
  lng: number;

  @Expose()
  year: number;

  @Expose()
  make: string;

  @Expose()
  model: string;

  @Expose()
  mileage: string;

  @Expose()
  @Transform(({ obj }) => obj.user.id)
  userId: number;
}
