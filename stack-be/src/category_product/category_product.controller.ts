import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { CategoryProductService } from "./category_product.service";
import { CreateCategoryProductDto } from "./dto/create-category_product.dto";
import { UpdateCategoryProductDto } from "./dto/update-category_product.dto";
import { Public, ResponseMessage } from "@/decorator/customize";

@Controller("category-product")
export class CategoryProductController {
  constructor(private readonly categoryProductService: CategoryProductService) {}

  @Post()
  create(@Body() createCategoryProductDto: CreateCategoryProductDto) {
    return this.categoryProductService.create(createCategoryProductDto);
  }

  @Get("get-category-by-name")
  findCategoryByName() {
    return this.categoryProductService.findAll();
  }
  @Public()
  @Get("list")
  @ResponseMessage("Get category product")
  getCategories() {
    return this.categoryProductService.getCategories();
  }
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.categoryProductService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateCategoryProductDto: UpdateCategoryProductDto) {
    return this.categoryProductService.update(+id, updateCategoryProductDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.categoryProductService.remove(+id);
  }
}
