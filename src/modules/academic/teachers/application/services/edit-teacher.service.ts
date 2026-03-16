import { TeacherDto } from '../dto/teacher.dto';
import { TEACHER_REPOSITORY, 
type TeacherRepository } 
from '@academic/teachers/domain/repositories/teacher-repository.interface';
import { Inject, Injectable, NotFoundException, ConflictException } from '@nestjs/common';

@Injectable()
export class EditTeacherService {
  constructor(
    @Inject(TEACHER_REPOSITORY)
    private readonly teacherRepository: TeacherRepository,
  ) {}

  async execute(id: string, dto: TeacherDto): Promise<void> {
    const teacher = await this.teacherRepository.findById(id);

    if (!teacher) {
      throw new NotFoundException("Teacher not found");
    }

    if (dto.email && dto.email !== teacher.email) {
      const existing = await this.teacherRepository.findByEmail(dto.email);

      if (existing) {
        throw new ConflictException("E-mail alredy registered");
      }
    }
    // registration is immutable after creation
    teacher.withDocument(dto.document).withEmail(dto.email).withName(dto.name);
    await this.teacherRepository.update(teacher!);
  }
}
