import { IsNotEmpty } from "class-validator";

export class ProductQueryDto {
  q: string;

  category_product_id: string;
  category_product_slug: string;

  @IsNotEmpty()
  page: number;

  @IsNotEmpty()
  limit: number;
}
