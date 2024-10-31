import { PrismaModule } from "@/prisma/prisma.module";
import { Module } from "@nestjs/common";
import { PaymentMethodController } from "./payment-method.controller";
import { PaymentMethodService } from "./payment-method.service";

@Module({
  imports: [PrismaModule],
  controllers: [PaymentMethodController],
  providers: [PaymentMethodService]
})
export class PaymentMethodModule {}
