import { IsNotEmpty } from "class-validator";

export class OrderQuery {
  orders_name: string;
  orders_mobile: string;
  orders_date: Date;
  @IsNotEmpty()
  page: number;
  @IsNotEmpty()
  limit: number;
}
