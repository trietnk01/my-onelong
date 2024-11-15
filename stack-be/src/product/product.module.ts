import { CategoryProductModule } from "@/category-product/category-product.module";
import { PrismaModule } from "@/prisma/prisma.module";
import { Module } from "@nestjs/common";
import { ElasticsearchModule } from "@nestjs/elasticsearch";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";

@Module({
  imports: [ElasticsearchModule, PrismaModule, CategoryProductModule],
  controllers: [ProductController],
  providers: [ProductService]
})
export class ProductModule {}
