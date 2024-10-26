import { Body, Controller, Post } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { Public, ResponseMessage } from "@/decorator/customize";
import { CreateOrdersDto } from "./dto/create-orders.dto";

@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Public()
  @Post("/create")
  @ResponseMessage("Create order")
  createOrder(@Body() prodCreateDto: CreateOrdersDto) {
    return this.ordersService.create(prodCreateDto);
  }
}
