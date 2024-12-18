import { Public, ResponseMessage } from "@/decorator/customize";
import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { QueryUserDto } from "./dto/query-user.dto";
import { UserService } from "./users.service";
@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @ResponseMessage("Create user successfully")
  @Post("register")
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ResponseMessage("Get user by username param successfully")
  @Get()
  findByUsername(@Query() query: QueryUserDto) {
    return this.userService.findByUsername(query.username);
  }

  @ResponseMessage("Get user by username and role param successfully")
  @Get(":username/:role")
  findByUsernameParam(@Param("username") username: string, @Param("role") role: string) {
    return { username, role };
  }

  @ResponseMessage("Get user by username and role query successfully")
  @Get()
  findByUsernameQuery(@Query() query: QueryUserDto) {
    const username: string = query.username;
    const role: string = query.role;
    return { username, role };
  }

  @ResponseMessage("Import data")
  @Post("import-data")
  importData() {
    return this.userService.importData();
  }
}
