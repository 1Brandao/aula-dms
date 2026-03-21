import type { CreateUserDto } from "@users/application/dto/create-user.dto";
import { UserService } from "@users/application/services/user.service";
import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { Permission } from "@shared/domain/enums/permission.enum";
import { Public } from "@shared/infra/decorators/public.decorator";
import { RequirePermissions } from "@shared/infra/decorators/permissions.decorator";

@Controller("users")
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Public()
  async create(@Body() body: CreateUserDto) {
    return this.userService.create(body);
  }

  @Get()
  @RequirePermissions(Permission.USERS_READ)
  async findAll() {
    return this.userService.findAll();
  }

  @Get(":id")
  @RequirePermissions(Permission.USERS_READ)
  async findById(@Param("id") id: string) {
    return this.userService.findById(id);
  }

  @Patch(":id")
  @RequirePermissions(Permission.USERS_WRITE)
  async update(@Param("id") id: string, @Body() body: Partial<CreateUserDto>) {
    return this.userService.update(id, body);
  }

  @Delete(":id")
  @RequirePermissions(Permission.USERS_DELETE)
  async delete(@Param("id") id: string) {
    return this.userService.delete(id);
  }
}
