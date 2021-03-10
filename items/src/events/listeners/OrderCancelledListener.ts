import { Message } from "node-nats-streaming";
import { queueGroupName } from "./QueueGroupName";
import { Listener, OrderCancelledEvent, Subjects } from "@ohalaszdev/common";
import { DOCUMENT_VERSION_INCREMENT, Item } from "../../models/item";
import { ItemUpdatedPublisher } from "../publishers/ItemUpdatedPublisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  readonly queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    const item = await Item.findById(data.item.id);
    if (!item) {
      throw new Error("Item not found");
    }

    // Set the orderId to undefined since the order was cancelled
    item.set({
      orderId: undefined,
      version: item.version + DOCUMENT_VERSION_INCREMENT,
    });
    await item.save();

    await new ItemUpdatedPublisher(this.client).publish({
      id: item.id,
      title: item.title,
      price: item.price,
      userId: item.userId,
      orderId: item.orderId,
      version: item.version,
    });

    msg.ack();
  }
}
