import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { Public, ResponseMessage } from "@/decorator/customize";
import { CreateOrdersDto } from "./dto/create-orders.dto";
import { OrderQuery } from "./dto/order-query.dto";

@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Public()
  @Post("/create")
  @ResponseMessage("Create order")
  createOrder(@Body() prodCreateDto: CreateOrdersDto) {
    return this.ordersService.create(prodCreateDto);
  }

  @Get("/list")
  @ResponseMessage("Get list orders")
  getList(@Query() query: OrderQuery) {
    return this.ordersService.getList(query);
  }

  @Get("/detail/:id")
  @ResponseMessage("Get orders detail")
  getDetail(@Param("id", ParseIntPipe) id: number) {
    return this.ordersService.getDetail(id);
  }
}
