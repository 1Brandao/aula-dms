import {
  TEACHER_REPOSITORY,
  type TeacherRepository,
} from "@academic/teachers/domain/repositories/teacher-repository.interface";
import { Inject, Injectable } from "@nestjs/common";
import { TeacherDto } from "../dto/teacher.dto";

@Injectable()
export class ListTeachersService {
  constructor(
    @Inject(TEACHER_REPOSITORY)
    private readonly teacherRepository: TeacherRepository,
  ) {}

  async execute(params: { page: number; limit: number }): Promise<TeacherDto[]> {
    const { data } = await this.teacherRepository.findAll(params);
    return data.map((row) => TeacherDto.fromTeacher(row)!);
  }
}
