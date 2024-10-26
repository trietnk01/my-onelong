import { IsNotEmpty } from "class-validator";
export class CreateOrdersDto {
  @IsNotEmpty()
  orders_name: string;

  @IsNotEmpty()
  orders_mobile: string;

  @IsNotEmpty()
  payment_method_id: number;

  @IsNotEmpty()
  orders_product_json: string;
}
