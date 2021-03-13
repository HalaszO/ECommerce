import { Message } from "node-nats-streaming";
import { queueGroupName } from "./QueueGroupName";
import { Listener, OrderCreatedEvent, Subjects } from "@ohalaszdev/common";
import { expirationQueue } from "../../queues/expirationQueue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  readonly queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const delay = new Date(data.expiresAt).getMilliseconds() - Date.now();
    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay,
      }
    );
    msg.ack();
  }
}
