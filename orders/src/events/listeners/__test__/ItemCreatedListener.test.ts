import mongoose from "mongoose";
import { ItemCreatedEvent } from "@ohalaszdev/common";
import { natsWrapper } from "../../../natsWrapper";
import { ItemCreatedListener } from "./../ItemCreatedListener";
import { Message } from "node-nats-streaming";
import { Item } from "../../../models/item";

const init = async () => {
  // Creates instance of the listener
  const listener = new ItemCreatedListener(natsWrapper.client);
  // Creates fake data and message objects
  const data: ItemCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Waffle maker",
    price: 50,
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
  };
  // Only need ack function and Message type, so type error should be ignored this once
  // @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };

  return { listener, data, message };
};

it("Creates and saves the item to the DB", async () => {
  const { listener, data, message } = await init();

  // Call onMessage function
  await listener.onMessage(data, message);
  // Assert Item was created
  const item = await Item.findById(data.id);
  expect(item).toBeDefined();
  expect(item!.title).toEqual(data.title);
});

it("Acks the message", async () => {
  const { listener, data, message } = await init();

  // Call onMessage function
  await listener.onMessage(data, message);
  // Assert message.ack was called
  expect(message.ack).toHaveBeenCalled();
});
