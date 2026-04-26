import { TeachersModule } from "@academic/teachers/teachers.module";
import { Module } from "@nestjs/common";

@Module({
  imports: [TeachersModule],
})
export class AcademicModule {}
