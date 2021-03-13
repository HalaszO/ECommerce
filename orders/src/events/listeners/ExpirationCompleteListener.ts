import { OrderCancelledPublisher } from "./../publishers/OrderCancelledPublisher";
import { Message } from "node-nats-streaming";
import {
  ExpirationCompleteEvent,
  Listener,
  OrderStatus,
  Subjects,
} from "@ohalaszdev/common";
import { queueGroupName } from "./QueueGroupName";
import { DOCUMENT_VERSION_INCREMENT, Order } from "../../models/order";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
  readonly queueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
    const order = await Order.findById(data.orderId).populate("item");

    if (!order) {
      throw new Error("Order not found");
    }
    // If order was completed, do not cancel it, but return early instead
    if (order.status === OrderStatus.Completed) {
      return msg.ack();
    }

    order.set({
      status: OrderStatus.Cancelled,
      version: order.version + DOCUMENT_VERSION_INCREMENT,
    });

    await order.save();

    new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      userId: order.userId,
      version: order.version,
      item: {
        id: order.item.id,
      },
    });

    msg.ack();
  }
}
