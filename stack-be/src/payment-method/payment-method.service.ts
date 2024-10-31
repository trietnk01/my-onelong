import { BadRequestException, Injectable } from "@nestjs/common";
import { CreatePaymentMethodDto } from "./dto/create-payment-method.dto";
import { UpdatePaymentMethodDto } from "./dto/update-payment-method.dto";
import { PrismaService } from "@/prisma/prisma.service";

@Injectable()
export class PaymentMethodService {
  constructor(private prisma: PrismaService) {}
  create(createPaymentMethodDto: CreatePaymentMethodDto) {
    return "This action adds a new paymentMethod";
  }

  findAll = () => {
    try {
      return this.prisma.paymentMethod.findMany();
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  };

  findOne(id: number) {
    return `This action returns a #${id} paymentMethod`;
  }

  update(id: number, updatePaymentMethodDto: UpdatePaymentMethodDto) {
    return `This action updates a #${id} paymentMethod`;
  }

  remove(id: number) {
    return `This action removes a #${id} paymentMethod`;
  }
}
