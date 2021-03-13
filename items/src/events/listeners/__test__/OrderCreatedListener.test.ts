import mongoose from "mongoose";
import { OrderCreatedEvent, OrderStatus } from "@ohalaszdev/common";
import { natsWrapper } from "../../../natsWrapper";
import { OrderCreatedListener } from "../OrderCreatedListener";
import { Message } from "node-nats-streaming";
import { Item, DOCUMENT_VERSION_INCREMENT } from "../../../models/item";

const init = async () => {
  // Create test item
  const item = Item.build({
    title: "Waffle maker",
    price: 50,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });
  await item.save();
  // Creates instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client);
  // Creates fake data and message objects for the order
  const expiresAt = new Date();
  expiresAt.setSeconds(expiresAt.getSeconds() + 30 * 60);

  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: expiresAt.toISOString(),
    version: 0,
    item,
  };
  // Only need ack function and Message type, so type error should be ignored this once
  // @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };

  return { item, listener, data, message };
};

it("Locks the item upon a placed order", async () => {
  const { item, listener, data, message } = await init();

  await listener.onMessage(data, message);
  const queriedItem = await Item.findById(item.id);
  expect(queriedItem).toBeDefined();
  expect(queriedItem!.orderId).toBeDefined();
  expect(queriedItem!.orderId).toEqual(data.id);
});

it("Acks the message", async () => {
  const { listener, data, message } = await init();

  // Call onMessage function
  await listener.onMessage(data, message);
  // Assert message.ack was called
  expect(message.ack).toHaveBeenCalled();
});

it("Publishes an ItemUpdatedEvent with the correct item id and version", async () => {
  const { item, listener, data, message } = await init();
  await listener.onMessage(data, message);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );
  expect(eventData.id).toEqual(item.id);
  expect(eventData.version).toEqual(item.version + DOCUMENT_VERSION_INCREMENT);
});
