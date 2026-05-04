import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { MessagingService } from "@messaging/application/services/messaging.service";

const EXCHANGE_TYPE = "direct";

const TEACHER_CREATED_EXCHANGE = "academic.teachers.created.exchange";
const TEACHER_UPDATED_EXCHANGE = "academic.teachers.updated.exchange";
const TEACHER_DELETED_EXCHANGE = "academic.teachers.deleted.exchange";

const TEACHER_CREATED_ROUTING_KEY = "teacher.created";
const TEACHER_UPDATED_ROUTING_KEY = "teacher.updated";
const TEACHER_DELETED_ROUTING_KEY = "teacher.deleted";

export type TeacherEventPayload = {
  id?: string;
  name?: string;
  email?: string;
  document?: string;
  degree?: string;
  specialization?: string;
  admissionDate?: Date;
};

@Injectable()
export class TeacherEventsPublisher implements OnModuleInit {
  private readonly logger = new Logger(TeacherEventsPublisher.name);

  constructor(private readonly messagingService: MessagingService) {}

  async onModuleInit(): Promise<void> {
    await this.messagingService.createExchange(TEACHER_CREATED_EXCHANGE, EXCHANGE_TYPE);
    await this.messagingService.createExchange(TEACHER_UPDATED_EXCHANGE, EXCHANGE_TYPE);
    await this.messagingService.createExchange(TEACHER_DELETED_EXCHANGE, EXCHANGE_TYPE);
    this.logger.log("Teacher exchanges asserted");
  }

  async publishCreated(payload: TeacherEventPayload): Promise<void> {
    await this.messagingService.publish(
      JSON.stringify(payload),
      TEACHER_CREATED_EXCHANGE,
      TEACHER_CREATED_ROUTING_KEY,
    );
  }

  async publishUpdated(payload: TeacherEventPayload): Promise<void> {
    await this.messagingService.publish(
      JSON.stringify(payload),
      TEACHER_UPDATED_EXCHANGE,
      TEACHER_UPDATED_ROUTING_KEY,
    );
  }

  async publishDeleted(id: string): Promise<void> {
    await this.messagingService.publish(
      JSON.stringify({ id }),
      TEACHER_DELETED_EXCHANGE,
      TEACHER_DELETED_ROUTING_KEY,
    );
  }
}
