import { PrismaModule } from "@/prisma/prisma.module";
import { Module } from "@nestjs/common";
import { UserController } from "./users.controller";
import { UserService } from "./users.service";

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
