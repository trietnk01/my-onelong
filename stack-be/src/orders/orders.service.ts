import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { ConfigService } from "@nestjs/config";
import { CreateOrdersDto } from "./dto/create-orders.dto";
import { OrderQuery } from "./dto/order-query.dto";

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
          payment_method_id: prodCreateDto.payment_method_id,
          orders_detail: {
            create: productLst
          }
        }
      });
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  };
  getList = async (query: OrderQuery) => {
    try {
      let where: any = {};
      if (query.orders_name) {
        where["orders_name"] = query.orders_name;
      }
      if (query.orders_mobile) {
        where["orders_mobile"] = query.orders_mobile;
      }
      if (query.orders_date) {
        where["orders_date"] = new Date(query.orders_date);
      }
      const skip: number = (query.page - 1) * query.limit;
      const total: number = await this.prisma.orders.count({ where });
      const orders: any = await this.prisma.orders.findMany({
        where,
        select: {
          orders_name: true,
          orders_mobile: true,
          orders_date: true,
          payment_method: {
            select: {
              id: true,
              title: true
            }
          }
        },
        skip,
        take: query.limit ? query.limit : 10
      });
      return { orders, total };
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  };
  getDetail = (id: number) => {
    try {
      return this.prisma.orders.findUnique({
        where: { id },
        select: {
          id: true,
          orders_date: true,
          orders_detail: {
            select: {
              orders_product_name: true,
              orders_product_image: true,
              orders_price: true,
              orders_quantity: true
            }
          },
          orders_name: true,
          orders_mobile: true,
          payment_method: {
            select: { title: true }
          }
        }
      });
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  };
}
