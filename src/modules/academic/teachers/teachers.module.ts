import { TeacherService } from "@academic/teachers/application/services/teacher.service";
import { TEACHER_REPOSITORY } from "@academic/teachers/domain/repositories/teacher-repository.interface";
import { TeachersController } from "@academic/teachers/infra/controllers/teachers.controller";
import { TeacherEventsPublisher } from "@academic/teachers/infra/messaging/teacher-events.publisher";
import { DrizzleTeacherRepository } from "@academic/teachers/infra/repositories/drizzle-teacher.repository";
import { MessagingModule } from "@messaging/messaging.module";
import { Module } from "@nestjs/common";
import { SharedModule } from "@shared/shared.module";

@Module({
  imports: [SharedModule, MessagingModule],
  controllers: [TeachersController],
  providers: [
    TeacherService,
    DrizzleTeacherRepository,
    {
      provide: TEACHER_REPOSITORY,
      useExisting: DrizzleTeacherRepository,
    },
    TeacherEventsPublisher,
  ],
})
export class TeachersModule {}
