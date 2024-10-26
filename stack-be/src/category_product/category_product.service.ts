import { Injectable } from "@nestjs/common";
import { CreateCategoryProductDto } from "./dto/create-category_product.dto";
import { UpdateCategoryProductDto } from "./dto/update-category_product.dto";
import { PrismaService } from "@/prisma/prisma.service";

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
  findAll() {
    return `This action returns all categoryProduct`;
  }

  findOne(id: number) {
    return `This action returns a #${id} categoryProduct`;
  }

  update(id: number, updateCategoryProductDto: UpdateCategoryProductDto) {
    return `This action updates a #${id} categoryProduct`;
  }

  remove(id: number) {
    return `This action removes a #${id} categoryProduct`;
  }
}
