import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { StudentsModule } from './modules/academic/students/students.module';
import { DatabaseModule } from './shared/infra/database/database.module';
import { TeachersModule } from './modules/academic/teachers/teachers.module';

@Module({
  imports: [ConfigModule.forRoot(), StudentsModule, DatabaseModule, TeachersModule],
})
export class AppModule {}
