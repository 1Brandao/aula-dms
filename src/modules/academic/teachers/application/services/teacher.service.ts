import { TeacherDto } from "@academic/teachers/application/dto/teacher.dto";
import { Teacher } from "@academic/teachers/domain/models/teacher.entity";
import {
  TEACHER_REPOSITORY,
  type TeacherRepository,
} from "@academic/teachers/domain/repositories/teacher-repository.interface";
import { TeacherEventsPublisher } from "@academic/teachers/infra/messaging/teacher-events.publisher";
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

@Injectable()
export class TeacherService {
  constructor(
    @Inject(TEACHER_REPOSITORY)
    private readonly teacherRepository: TeacherRepository,
    private readonly teacherEventsPublisher: TeacherEventsPublisher,
  ) {}

  private toDate(value: unknown): Date {
    if (value instanceof Date) {
      if (Number.isNaN(value.getTime())) {
        throw new BadRequestException("Invalid admissionDate");
      }
      return value;
    }

    if (typeof value === "string") {
      const parsed = new Date(value);
      if (Number.isNaN(parsed.getTime())) {
        throw new BadRequestException("Invalid admissionDate");
      }
      return parsed;
    }

    throw new BadRequestException("Invalid admissionDate");
  }

  async create(dto: TeacherDto): Promise<void> {
    const existing = await this.teacherRepository.findByEmail(dto.email);

    if (existing) {
      throw new ConflictException("Email already registered");
    }

    const teacher = Teacher.restore({
      ...dto,
      admissionDate: this.toDate(dto.admissionDate),
    });
    await this.teacherRepository.create(teacher!);

    const persisted = await this.teacherRepository.findByEmail(dto.email);
    await this.teacherEventsPublisher.publishCreated({
      id: persisted?.id,
      name: persisted?.name,
      email: persisted?.email,
      document: persisted?.document,
      degree: persisted?.degree,
      specialization: persisted?.specialization,
      admissionDate: persisted?.admissionDate,
    });
  }

  async edit(id: string, dto: TeacherDto): Promise<void> {
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

    teacher
      .withName(dto.name)
      .withEmail(dto.email)
      .withDocument(dto.document)
      .withDegree(dto.degree)
      .withSpecialization(dto.specialization)
      .withAdmissionDate(this.toDate(dto.admissionDate));

    await this.teacherRepository.update(teacher);

    await this.teacherEventsPublisher.publishUpdated({
      id: teacher.id,
      name: teacher.name,
      email: teacher.email,
      document: teacher.document,
      degree: teacher.degree,
      specialization: teacher.specialization,
      admissionDate: teacher.admissionDate,
    });
  }

  async remove(id: string): Promise<void> {
    await this.teacherRepository.delete(id);
    await this.teacherEventsPublisher.publishDeleted(id);
  }

  async list(): Promise<TeacherDto[]> {
    const response = await this.teacherRepository.findAll();
    return response.map((row) => TeacherDto.fromTeacher(row)!);
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
