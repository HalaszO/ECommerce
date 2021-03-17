import mongoose from "mongoose";
import { OrderCreatedEvent } from "@ohalaszdev/common";
import { natsWrapper } from "../../../natsWrapper";
import { OrderCreatedListener } from "../OrderCreatedListener";
import { Message } from "node-nats-streaming";
import {
  Order,
  OrderStatus,
  DOCUMENT_VERSION_INCREMENT,
} from "../../../models/order";

const init = async () => {
  // Creates instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  const expiresAt = new Date();
  expiresAt.setSeconds(expiresAt.getSeconds() + 30 * 60);
  // Creates fake data and message objects for the order
  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: expiresAt.toISOString(),
    version: 0,
    item: {
      id: new mongoose.Types.ObjectId().toHexString(),
      price: 100,
    },
  };
  // Only need ack function and Message type, so type error should be ignored this once
  // @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };

  return { listener, data, message };
};

it("Saves on order upon receiving an order:created event", async () => {
  const { listener, data, message } = await init();

  await listener.onMessage(data, message);
  const queriedOrder = await Order.findById(data.id);
  expect(queriedOrder).toBeDefined();
  expect(queriedOrder!.id).toEqual(data.id);
});

it("Acks the message", async () => {
  const { listener, data, message } = await init();

  // Call onMessage function
  await listener.onMessage(data, message);
  // Assert message.ack was called
  expect(message.ack).toHaveBeenCalled();
});
