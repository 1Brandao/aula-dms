import { TEACHER_REPOSITORY, type TeacherRepository } from '@academic/teachers/domain/repositories/teacher-repository.interface';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class RemoveTeacherService {
    constructor(
        @Inject(TEACHER_REPOSITORY)
        private readonly teacherRepository: TeacherRepository,
    ) {}

    async execute(id: string): Promise<void> {
        const teacher = await this.teacherRepository.findById(id);
        if (!teacher) {
            throw new NotFoundException("Teacher not found");
        }
        await this.teacherRepository.delete(id);
    }
}
