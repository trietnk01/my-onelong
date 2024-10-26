import { Module } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { SeachModule } from "@/search/search.module";
import { PrismaModule } from "@/prisma/prisma.module";
import { CategoryProductModule } from "@/category_product/category_product.module";

@Module({
  imports: [SeachModule, PrismaModule, CategoryProductModule],
  controllers: [ProductController],
  providers: [ProductService]
})
export class ProductModule {}
