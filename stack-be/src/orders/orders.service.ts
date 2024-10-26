import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { ConfigService } from "@nestjs/config";
import { CreateOrdersDto } from "./dto/create-orders.dto";

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private confService: ConfigService
  ) {}
  create = (prodCreateDto: CreateOrdersDto) => {
    try {
      const d = new Date();
      const productLst: any[] = JSON.parse(prodCreateDto.orders_product_json);
      return this.prisma.orders.create({
        data: {
          orders_name: prodCreateDto.orders_name,
          orders_mobile: prodCreateDto.orders_mobile,
          orders_date: new Date(),
          orders_detail: {
            create: productLst
          }
        }
      });
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  };
}
