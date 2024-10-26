import { IsNotEmpty } from "class-validator";

export class OrderQuery {
  orders_name: string;
  orders_mobile: string;
  orders_start_date: Date;
  orders_end_date: Date;
  @IsNotEmpty()
  page: number;
  @IsNotEmpty()
  limit: number;
}
