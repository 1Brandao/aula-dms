import { AcademicModule } from "@academic/academic.module";
import { MessagingModule } from "@messaging/messaging.module";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SharedModule } from "@shared/shared.module";

@Module({
  imports: [ConfigModule.forRoot(), SharedModule, MessagingModule, AcademicModule],
})
export class AppModule {}
