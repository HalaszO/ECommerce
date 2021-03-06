import { queueGroupName } from "./QueueGroupName";
import { Message } from "node-nats-streaming";
import { ItemCreatedEvent, Listener, Subjects } from "@ohalaszdev/common";
import { Item } from "../../models/item";

export class ItemCreatedListener extends Listener<ItemCreatedEvent> {
  readonly subject = Subjects.ItemCreated;
  readonly queueGroupName = queueGroupName;

  async onMessage(data: ItemCreatedEvent["data"], msg: Message) {
    const { id, title, price } = data;
    const item = Item.build({
      id,
      title,
      price,
    });
    await item.save();
    msg.ack();
  }
}
