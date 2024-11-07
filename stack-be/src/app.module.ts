import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { AuthModule } from "./auth/auth.module";
import { ProductModule } from "./product/product.module";
import { UserModule } from "./users/users.module";
import { CategoryProductModule } from "./category-product/category-product.module";
import { OrdersModule } from "./orders/orders.module";
import { PaymentMethodModule } from "./payment-method/payment-method.module";
import { ElasticsearchModule } from "@nestjs/elasticsearch";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "public")
    }),
    /* ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (confService: ConfigService) => ({
        node: confService.get<string>("ELASTIC_NODE"),
        maxRetries: 10,
        requestTimeout: 60000,
        pingTimeout: 60000,
        sniffOnStart: true,
        headers: {
          Accept: "application/vnd.elasticsearch+json;compatible-with=8",
          "Content-Type": "application/vnd.elasticsearch+json;compatible-with=8"
        },
        auth: {
          username: confService.get<string>("ELASTIC_USERNAME"),
          password: confService.get<string>("ELASTIC_PASSWORD")
        }
      }),
      inject: [ConfigService]
    }), */
    UserModule,
    AuthModule,
    ProductModule,
    CategoryProductModule,
    OrdersModule,
    PaymentMethodModule
  ]
})
export class AppModule {}
