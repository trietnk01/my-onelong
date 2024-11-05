import { AppModule } from "@/app.module";
import { JwtAuthGuard } from "@/auth/jwt-auth.guard";
import { TransformInterceptor } from "@/core/transform.interceptor";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory, Reflector } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import cookieParser from "cookie-parser";
import { join } from "path";
import { PrismaService } from "./prisma/prisma.service";
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const confService = app.get(ConfigService);
  const reflector = app.get(Reflector);
  const prisma = new PrismaService();
  app.useGlobalGuards(new JwtAuthGuard(prisma, reflector));
  app.useGlobalInterceptors(new TransformInterceptor(reflector));
  app.useStaticAssets(join(__dirname, "..", "public"));
  app.setBaseViewsDir(join(__dirname, "..", "views"));
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.enableCors();
  const port: string = confService.get<string>("PORT");
  console.log("port = ", port);
  await app.listen(port);
}
bootstrap();
