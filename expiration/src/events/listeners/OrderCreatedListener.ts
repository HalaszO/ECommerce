import { Message } from "node-nats-streaming";
import { queueGroupName } from "./QueueGroupName";
import { Listener, OrderCreatedEvent, Subjects } from "@ohalaszdev/common";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  readonly queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {}
}
