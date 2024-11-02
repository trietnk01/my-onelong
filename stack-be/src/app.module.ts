import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { AuthModule } from "./auth/auth.module";
import { ProductModule } from "./product/product.module";
import { UserModule } from "./users/users.module";
import { CategoryProductModule } from "./category_product/category_product.module";
import { OrdersModule } from "./orders/orders.module";
import { PaymentMethodModule } from "./payment-method/payment-method.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [".env", ".env.production"],
      isGlobal: true
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "public")
    }),
    UserModule,
    AuthModule,
    ProductModule,
    CategoryProductModule,
    OrdersModule,
    PaymentMethodModule
  ]
})
export class AppModule {}
