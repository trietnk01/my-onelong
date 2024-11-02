import { Module } from "@nestjs/common";
import { CategoryProductService } from "./category-product.service";
import { CategoryProductController } from "./category-product.controller";
import { PrismaModule } from "@/prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [CategoryProductController],
  providers: [CategoryProductService],
  exports: [CategoryProductService]
})
export class CategoryProductModule {}
