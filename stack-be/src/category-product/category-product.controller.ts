import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { CategoryProductService } from "./category-product.service";
import { CreateCategoryProductDto } from "./dto/create-category-product.dto";
import { UpdateCategoryProductDto } from "./dto/update-category-product.dto";
import { Public, ResponseMessage } from "@/decorator/customize";

@Controller("category-product")
export class CategoryProductController {
  constructor(private readonly categoryProductService: CategoryProductService) {}

  @Post()
  create(@Body() createCategoryProductDto: CreateCategoryProductDto) {
    return this.categoryProductService.create(createCategoryProductDto);
  }
  @Public()
  @Get("list")
  @ResponseMessage("Get category product")
  getCategories() {
    return this.categoryProductService.getCategories();
  }
}
