import { Expose, Transform } from 'class-transformer';
import { CreateReportDto } from './create-report-dto';

export class ReportDto implements CreateReportDto {
  @Expose()
  price: number;
  @Expose()
  make: string;
  @Expose()
  model: string;
  @Expose()
  year: number;
  @Expose()
  mileage: number;
  @Expose()
  lng: number;
  @Expose()
  lat: number;
  @Transform(({ obj }) => obj.user.id)
  @Expose()
  userId: number;
}
