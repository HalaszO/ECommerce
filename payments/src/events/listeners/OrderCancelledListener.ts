import {
  Listener,
  OrderCancelledEvent,
  OrderStatus,
  Subjects,
} from "@ohalaszdev/common";
import { Message } from "node-nats-streaming";
import { DOCUMENT_VERSION_INCREMENT, Order } from "../../models/order";
import { queueGroupName } from "./queueGroupName";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  readonly queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    const order = await Order.findByEvent(data);
    if (!order) {
      throw new Error("Order not found");
    }
    order.set({
      status: OrderStatus.Cancelled,
      version: order.version + DOCUMENT_VERSION_INCREMENT,
    });
    await order.save();
    // Todo: Cancel payment

    msg.ack();
  }
}
