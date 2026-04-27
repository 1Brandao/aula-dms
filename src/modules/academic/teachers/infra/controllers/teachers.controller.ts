import {
  CreateTeacherDto,
  TeacherDto,
  UpdateTeacherDto,
} from "@academic/teachers/application/dto/teacher.dto";
import { TeacherService } from "@academic/teachers/application/services/teacher.service";
import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { HateoasItem, HateoasList } from "@shared/infra/hateoas";

@Controller("teachers")
export class TeachersController {
  constructor(private readonly teacherService: TeacherService) {}

  @Get()
  @HateoasList<TeacherDto>({
    basePath: "/v1/teachers",
    itemLinks: (item) => ({
      self: { href: `/v1/teachers/${item.id}`, method: "GET" },
      update: { href: `/v1/teachers/${item.id}`, method: "PUT" },
      delete: { href: `/v1/teachers/${item.id}`, method: "DELETE" },
    }),
  })
  async findAll(
    @Query("_page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("_size", new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.teacherService.list({ page, limit });
  }

  @Get(":id")
  @HateoasItem<TeacherDto>({
    basePath: "/v1/teachers",
    itemLinks: (item) => ({
      self: { href: `/v1/teachers/${item.id}`, method: "GET" },
      update: { href: `/v1/teachers/${item.id}`, method: "PUT" },
      delete: { href: `/v1/teachers/${item.id}`, method: "DELETE" },
      list: { href: "/v1/teachers", method: "GET" },
      create: { href: "/v1/teachers", method: "POST" },
    }),
  })
  async findById(@Param("id") id: string) {
    return this.teacherService.findById(id);
  }

  @Post()
  async create(@Body() body: CreateTeacherDto) {
    return this.teacherService.create(body);
  }

  @Put(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(@Param("id") id: string, @Body() body: UpdateTeacherDto) {
    return this.teacherService.edit(id, body);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param("id") id: string) {
    return this.teacherService.remove(id);
  }
}
