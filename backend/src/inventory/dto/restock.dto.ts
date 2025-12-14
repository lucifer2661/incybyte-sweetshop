import { IsNumber, IsPositive } from 'class-validator';

export class RestockDto {
  @IsNumber()
  @IsPositive()
  amount: number;
}

