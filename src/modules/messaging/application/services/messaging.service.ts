import { Injectable } from "@nestjs/common";
import { RabbitMQService } from "@messaging/infra/rabbitmq/rabbitmq.service";
import type { ConsumeMessage } from "amqplib";

export type MessageHandler = (content: string, raw: ConsumeMessage) => Promise<void> | void;

@Injectable()
export class MessagingService {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  async createExchange(name: string, type: string): Promise<void> {
    const channel = this.rabbitMQService.getChannel();
    await channel.assertExchange(name, type, { durable: true });
  }

  async createQueue(queueName: string, exchangeName: string, routingKey: string): Promise<void> {
    const channel = this.rabbitMQService.getChannel();
    await channel.assertQueue(queueName, { durable: true });
    await channel.bindQueue(queueName, exchangeName, routingKey);
  }

  async publish(content: string, exchangeName: string, routingKey: string): Promise<void> {
    const channel = this.rabbitMQService.getChannel();
    channel.publish(exchangeName, routingKey, Buffer.from(content), { persistent: true });
  }

  async subscribe(queueName: string, handler: MessageHandler): Promise<void> {
    const channel = this.rabbitMQService.getChannel();
    await channel.consume(queueName, async (msg) => {
      if (!msg) return;
      try {
        await handler(msg.content.toString(), msg);
        channel.ack(msg);
      } catch {
        channel.nack(msg, false, false);
      }
    });
  }
}
