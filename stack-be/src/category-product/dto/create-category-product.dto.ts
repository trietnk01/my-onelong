import { IsNotEmpty } from "class-validator";
export class CreateCategoryProductDto {
  id: number;

  @IsNotEmpty()
  category_name: string;

  @IsNotEmpty()
  slug: string;
}
