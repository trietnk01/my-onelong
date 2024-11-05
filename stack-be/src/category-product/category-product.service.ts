import { PrismaService } from "@/prisma/prisma.service";
import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateCategoryProductDto } from "./dto/create-category-product.dto";

@Injectable()
export class CategoryProductService {
  constructor(private prisma: PrismaService) {}
  create(createCategoryProductDto: CreateCategoryProductDto) {
    return this.prisma.categoryProduct.create({
      data: {
        category_name: createCategoryProductDto.category_name,
        slug: createCategoryProductDto.slug
      }
    });
  }
  findByAlias = (alias: string) => {
    return this.prisma.categoryProduct.findUnique({ where: { slug: alias } });
  };
  getCategories = async () => {
    try {
      return this.prisma.categoryProduct.findMany();
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  };
}
