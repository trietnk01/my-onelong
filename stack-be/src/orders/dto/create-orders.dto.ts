import { IsNotEmpty } from "class-validator";
export class CreateOrdersDto {
  @IsNotEmpty()
  orders_name: string;

  @IsNotEmpty()
  orders_mobile: string;

  @IsNotEmpty()
  orders_product_json: string;
}
