import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MessagingService } from "./application/services/messaging.service";
import { RabbitMQService } from "./infra/rabbitmq/rabbitmq.service";

@Module({
  imports: [ConfigModule],
  providers: [RabbitMQService, MessagingService],
  exports: [MessagingService, RabbitMQService],
})
export class MessagingModule {}
