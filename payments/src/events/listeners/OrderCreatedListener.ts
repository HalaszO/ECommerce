import { Subjects } from "@ohalaszdev/common";
import { Listener, OrderCreatedEvent } from "@ohalaszdev/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "./queueGroupName";
export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  readonly queueGroupName = queueGroupName;
  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const order = Order.build({
      id: data.id,
      status: data.status,
      price: data.item.price,
      userId: data.userId,
    });
    await order.save();

    msg.ack();
  }
}
