import { queueGroupName } from "./QueueGroupName";
import { Message } from "node-nats-streaming";
import { ItemUpdatedEvent, Listener, Subjects } from "@ohalaszdev/common";
import { Item } from "../../models/item";

export class ItemUpdatedListener extends Listener<ItemUpdatedEvent> {
  readonly subject = Subjects.ItemUpdated;
  readonly queueGroupName = queueGroupName;

  async onMessage(data: ItemUpdatedEvent["data"], msg: Message) {
    // Getting previous version of the item from the DB
    const item = await Item.findByEvent(data);
    if (!item) {
      throw new Error("Item not found");
    }
    const { title, price, version } = data;

    // Saving updated item
    item.set({ title, price, version });
    await item.save();

    // ack to NATS
    msg.ack();
  }
}
