import {
  Listener,
  OrderStatus,
  PaymentCreatedEvent,
  Subjects,
} from "@ohalaszdev/common";
import { Message } from "node-nats-streaming";
import { DOCUMENT_VERSION_INCREMENT, Order } from "../../models/order";
import { queueGroupName } from "./QueueGroupName";
import { OrderUpdatedPublisher } from "../publishers/OrderUpdatedPublisher";
import { natsWrapper } from "../../natsWrapper";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
  readonly queueGroupName = queueGroupName;
  async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
    const { orderId } = data;
    const order = await Order.findById({ orderId });
    if (!order) {
      throw new Error("Order not found");
    }
    order.set({
      status: OrderStatus.Completed,
      version: order.version + DOCUMENT_VERSION_INCREMENT,
    });
    await order.save();

    // Publishing an order:updated event, just for consistency
    await new OrderUpdatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      version: order.version,
      item: { id: order.item.id, price: order.item.price },
    });

    msg.ack();
  }
}
