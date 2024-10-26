import { IsNotEmpty } from "class-validator";

export class ProductInputDto {
  id: number;

  @IsNotEmpty()
  category_product_id: number;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  stock: number;

  thumbnail: string;
  image: string;
}
