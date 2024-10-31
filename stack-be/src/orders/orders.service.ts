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
      let sku: string = "";
      const characters = "123456789";
      const charactersLength = characters.length;
      let counter = 0;
      while (counter < charactersLength) {
        sku += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
      }
      return this.prisma.orders.create({
        data: {
          orders_sku: sku,
          orders_name: prodCreateDto.orders_name,
          orders_mobile: prodCreateDto.orders_mobile,
          orders_date: new Date(),
          payment_method_id: parseInt(prodCreateDto.payment_method_id.toString()),
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
      let where = {};
      if (query.orders_sku) {
        where["orders_sku"] = { contains: query.orders_sku };
      }
      if (query.orders_name) {
        where["orders_name"] = { contains: query.orders_name };
      }
      if (query.orders_mobile) {
        where["orders_mobile"] = { contains: query.orders_mobile };
      }
      if (query.orders_start_date && query.orders_end_date) {
        let startDate: Date = new Date(`${query.orders_start_date}`);
        let endDate: Date = new Date(`${query.orders_end_date}`);
        where["orders_date"] = { gt: startDate, lt: endDate };
      }
      const skip: number = (parseInt(query.page.toString()) - 1) * parseInt(query.limit.toString());
      const total: number = await this.prisma.orders.count({ where });
      const orders: any = await this.prisma.orders.findMany({
        where,
        select: {
          id: true,
          orders_sku: true,
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
        take: query.limit ? parseInt(query.limit.toString()) : 10
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
          orders_sku: true,
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
