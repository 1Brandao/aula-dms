import { TEACHER_REPOSITORY, type TeacherRepository } from '@academic/teachers/domain/repositories/teacher-repository.interface';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TeacherDto } from '../dto/teacher.dto';

@Injectable()
export class ReturnTeacherService {
    constructor(
        @Inject(TEACHER_REPOSITORY)
        private readonly teacherRepository: TeacherRepository,
    ) {}

    async executeById(id: string): Promise<TeacherDto | null> {
        const teacher = await this.teacherRepository.findById(id);
        
        if (!teacher) {
            throw new NotFoundException("Teacher not founded");
        }

        return TeacherDto.fromTeacher(teacher);
    }

    async executeByEmail(email: string): Promise<TeacherDto | null> {
        const teacher = await this.teacherRepository.findByEmail(email);
        if (!teacher) {
            throw new NotFoundException("Teacher not founded");
        }
        return TeacherDto.fromTeacher(teacher);
    }
}
