import { Module } from '@nestjs/common';
import { CreateTeacherService } from './application/services/create-teacher.service';
import { TeachersController } from './infra/controllers/teachers.controller';
import { RemoveTeacherService } from './application/services/remove-teacher.service';
import { ReturnTeacherService } from './application/services/return-teacher.service';
import { DatabaseModule } from '@infra/database/database.module';
import { EditTeacherService } from './application/services/edit-teacher.service';
import { ListTeachersService } from './application/services/list-teacher.service';
import { DrizzleTeacherRepository } from './infra/repositories/drizzle-teacher.repository';
import { TEACHER_REPOSITORY } from './domain/repositories/teacher-repository.interface';

@Module({
  imports: [DatabaseModule],
  controllers: [TeachersController],
  providers: [
    CreateTeacherService,
    EditTeacherService,
    RemoveTeacherService,
    ListTeachersService,
    ReturnTeacherService,
    DrizzleTeacherRepository,
    {
      provide: TEACHER_REPOSITORY,
      useExisting: DrizzleTeacherRepository,
    }
  ],
})
export class TeachersModule {}
