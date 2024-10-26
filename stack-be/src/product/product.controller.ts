import { ResponseMessage } from "@/decorator/customize";
import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { ProductInputDto } from "./dto/product-input.dto";
import { ProductQueryDto } from "./dto/product-query.dto";
import { ProductService } from "./product.service";

@Controller("product")
export class ProductController {
  constructor(private readonly prodService: ProductService) {}
  @Get("/list")
  @ResponseMessage("Get product list detail")
  getProduct(@Query() query: ProductQueryDto) {
    return this.prodService.getProducts(query);
  }

  @Get("/detail/:id")
  @ResponseMessage("Get product detail")
  getProductDetail(@Param("id") id: number) {
    return this.prodService.getProductDetail(id);
  }

  @Get("/category")
  @ResponseMessage("Get category product")
  getCategoryProduct() {
    return this.prodService.getCategoryProduct();
  }

  @Post("/save")
  @ResponseMessage("Save product")
  saveProduct(@Body() prodInput: ProductInputDto) {
    return this.prodService.save(prodInput);
  }

  @Post("/import")
  @ResponseMessage("Import product")
  importProduct() {
    return this.prodService.import();
  }
}