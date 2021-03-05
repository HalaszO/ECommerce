import mongoose from "mongoose";
import { ItemUpdatedEvent } from "@ohalaszdev/common";
import { natsWrapper } from "../../../natsWrapper";
import { ItemUpdatedListener } from "../ItemUpdatedListener";
import { Message } from "node-nats-streaming";
import { Item, DOCUMENT_VERSION_INCREMENT } from "../../../models/item";

const init = async () => {
  // Creates and saves test item
  const originalItem = Item.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Waffle maker",
    price: 50,
  });
  await originalItem.save();

  // Creates instance of the listener
  const listener = new ItemUpdatedListener(natsWrapper.client);

  // Creates fake data and message objects
  const data: ItemUpdatedEvent["data"] = {
    id: originalItem.id,
    title: originalItem.title,
    price: 40,
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: originalItem.version + DOCUMENT_VERSION_INCREMENT,
  };

  // Only need ack function and Message type, so type error should be ignored this once
  // @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };

  return { originalItem, listener, data, message };
};

it("Updates and saves the item to the DB", async () => {
  const { originalItem, listener, data, message } = await init();

  // Call onMessage function
  await listener.onMessage(data, message);
  // Assert Item was updated
  const updatedItem = await Item.findById(originalItem.id);

  expect(updatedItem).toBeDefined();
  expect(updatedItem!.title).toEqual(data.title);
  expect(updatedItem!.price).toEqual(data.price);
  expect(updatedItem!.version).toEqual(data.version);
});

it("Acks the message", async () => {
  const { listener, data, message } = await init();

  // Call onMessage function
  await listener.onMessage(data, message);
  // Assert message.ack was called
  expect(message.ack).toHaveBeenCalled();
});

it("Does not ack msg if the event skipped a version", async () => {
  const { listener, data, message } = await init();

  data.version = 1000;

  try {
    await listener.onMessage(data, message);
  } catch (err) {}

  expect(message.ack).not.toHaveBeenCalled();
});
