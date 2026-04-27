import {
  CreateTeacherDto,
  TeacherDto,
  UpdateTeacherDto,
} from "@academic/teachers/application/dto/teacher.dto";
import { Teacher } from "@academic/teachers/domain/models/teacher.entity";
import {
  TEACHER_REPOSITORY,
  type TeacherRepository,
} from "@academic/teachers/domain/repositories/teacher-repository.interface";
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import type { PaginatedResult } from "@shared/infra/hateoas";

@Injectable()
export class TeacherService {
  constructor(
    @Inject(TEACHER_REPOSITORY)
    private readonly teacherRepository: TeacherRepository,
  ) {}

  async create(dto: CreateTeacherDto): Promise<void> {
    const existing = await this.teacherRepository.findByEmail(dto.email);

    if (existing) {
      throw new ConflictException("Email already registered");
    }

    const teacher = Teacher.restore({ ...dto });
    await this.teacherRepository.create(teacher!);
  }

  async edit(id: string, dto: UpdateTeacherDto): Promise<void> {
    const teacher = await this.teacherRepository.findById(id);

    if (!teacher) {
      throw new NotFoundException("Teacher not found");
    }

    if (dto.email && dto.email !== teacher.email) {
      const existing = await this.teacherRepository.findByEmail(dto.email);

      if (existing) {
        throw new ConflictException("Email already registered");
      }
    }

    if (dto.name !== undefined) teacher.withName(dto.name);
    if (dto.email !== undefined) teacher.withEmail(dto.email);
    if (dto.document !== undefined) teacher.withDocument(dto.document);
    if (dto.degree !== undefined) teacher.withDegree(dto.degree);
    if (dto.specialization !== undefined) teacher.withSpecialization(dto.specialization);
    if (dto.admissionDate !== undefined) teacher.withAdmissionDate(dto.admissionDate);

    await this.teacherRepository.update(teacher);
  }

  async remove(id: string): Promise<void> {
    await this.teacherRepository.delete(id);
  }

  async list(params: { page: number; limit: number }): Promise<PaginatedResult<TeacherDto>> {
    const { data, total } = await this.teacherRepository.findAll(params);
    return {
      data: data.map((row) => TeacherDto.fromTeacher(row)!),
      total,
      page: params.page,
      limit: params.limit,
    };
  }

  async findById(id: string): Promise<TeacherDto | null> {
    const response = await this.teacherRepository.findById(id);
    return TeacherDto.fromTeacher(response);
  }

  async findByEmail(email: string): Promise<TeacherDto | null> {
    const response = await this.teacherRepository.findByEmail(email);
    return TeacherDto.fromTeacher(response);
  }
}
