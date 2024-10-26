import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ElasticsearchModule } from "@nestjs/elasticsearch";

@Module({
  imports: [
    ConfigModule,
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (confService: ConfigService) => ({
        node: confService.get<string>("ELASTICSEARCH_NODE"),
        auth: {
          username: confService.get<string>("ELASTICSEARCH_USERNAME"),
          password: confService.get<string>("ELASTICSEARCH_PASSWORD")
        }
      }),
      inject: [ConfigService]
    })
  ],
  exports: [ElasticsearchModule]
})
export class SeachModule {}
