import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { MessagingService } from "@messaging/application/services/messaging.service";

const AUTH_CREATED_EXCHANGE = "auth.created.exchange";
const AUTH_UPDATED_EXCHANGE = "auth.updated.exchange";
const AUTH_DELETED_EXCHANGE = "auth.deleted.exchange";

const USER_CREATED_ROUTING_KEY = "user.created";
const USER_UPDATED_ROUTING_KEY = "user.updated";
const USER_DELETED_ROUTING_KEY = "user.deleted";

const AUTH_CREATED_QUEUE = "academic-teachers.auth.created.queue";
const AUTH_UPDATED_QUEUE = "academic-teachers.auth.updated.queue";
const AUTH_DELETED_QUEUE = "academic-teachers.auth.deleted.queue";

@Injectable()
export class AuthEventsConsumer implements OnModuleInit {
  private readonly logger = new Logger(AuthEventsConsumer.name);

  constructor(private readonly messagingService: MessagingService) {}

  async onModuleInit(): Promise<void> {
    try {
      await this.messagingService.createQueue(
        AUTH_CREATED_QUEUE,
        AUTH_CREATED_EXCHANGE,
        USER_CREATED_ROUTING_KEY,
      );
      await this.messagingService.createQueue(
        AUTH_UPDATED_QUEUE,
        AUTH_UPDATED_EXCHANGE,
        USER_UPDATED_ROUTING_KEY,
      );
      await this.messagingService.createQueue(
        AUTH_DELETED_QUEUE,
        AUTH_DELETED_EXCHANGE,
        USER_DELETED_ROUTING_KEY,
      );

      await this.messagingService.subscribe(AUTH_CREATED_QUEUE, (content) => {
        this.handleUserCreated(content);
      });
      await this.messagingService.subscribe(AUTH_UPDATED_QUEUE, (content) => {
        this.handleUserUpdated(content);
      });
      await this.messagingService.subscribe(AUTH_DELETED_QUEUE, (content) => {
        this.handleUserDeleted(content);
      });

      this.logger.log("Auth event consumers started");
    } catch (error) {
      this.logger.warn(
        `Auth exchanges not available yet (${(error as Error).message}). Consumer will be unavailable until auth service is running.`,
      );
    }
  }

  private handleUserCreated(content: string): void {
    this.logger.log(`user.created received: ${content}`);
  }

  private handleUserUpdated(content: string): void {
    this.logger.log(`user.updated received: ${content}`);
  }

  private handleUserDeleted(content: string): void {
    this.logger.log(`user.deleted received: ${content}`);
  }
}
