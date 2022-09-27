import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class PageableParams {
  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: 'Page number' })
  page?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: 'Page size' })
  size?: number;
}

export class Page<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalPages: number;
}
