import mongoose from "mongoose";
import { OrderCancelledEvent } from "@ohalaszdev/common";
import { natsWrapper } from "../../../natsWrapper";
import { Message } from "node-nats-streaming";
import {
  Order,
  OrderStatus,
  DOCUMENT_VERSION_INCREMENT,
} from "../../../models/order";
import { OrderCancelledListener } from "../OrderCancelledListener";

const init = async () => {
  // Create test order
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 50,
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });
  await order.save();
  // Creates instance of the listener
  const listener = new OrderCancelledListener(natsWrapper.client);
  // Creates fake data and message objects for the order
  // item does not matter according to the model
  const data: OrderCancelledEvent["data"] = {
    id: order.id,
    userId: order.userId,
    version: order.version + DOCUMENT_VERSION_INCREMENT,
    item: {
      id: new mongoose.Types.ObjectId().toHexString(),
    },
  };
  // Only need ack function and Message type, so type error should be ignored this once
  // @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };

  return { listener, data, message };
};

it("Cancels order upon receiveing an order:cancel event", async () => {
  const { listener, data, message } = await init();

  await listener.onMessage(data, message);
  const queriedOrder = await Order.findById(data.id);

  expect(queriedOrder).toBeDefined();
  expect(queriedOrder!.version).toEqual(data.version);
  expect(queriedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("Acks the message", async () => {
  const { listener, data, message } = await init();

  // Call onMessage function
  await listener.onMessage(data, message);
  // Assert message.ack was called
  expect(message.ack).toHaveBeenCalled();
});
