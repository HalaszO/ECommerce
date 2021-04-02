import mongoose from "mongoose";
import { ExpirationCompleteEvent, OrderStatus } from "@ohalaszdev/common";
import { natsWrapper } from "../../../natsWrapper";
import { ExpirationCompleteListener } from "../ExpirationCompleteListener";
import { Message } from "node-nats-streaming";
import { Item } from "../../../models/item";
import { Order } from "../../../models/order";

const init = async () => {
  // Create test item
  const item = Item.build({
    title: "Waffle maker",
    price: 50,
    id: new mongoose.Types.ObjectId().toHexString(),
  });

  // Set order expiration date for 30 min from now
  const expiresAt = new Date();
  expiresAt.setSeconds(expiresAt.getSeconds() + 30 * 60);

  // Create test order referencing the item
  const order = Order.build({
    userId: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    expiresAt,
    item,
  });
  await order.save();

  // Attach the order to the item and save item
  item.set({ orderId: order.id });
  await item.save();

  // Creates instance of the listener
  const listener = new ExpirationCompleteListener(natsWrapper.client);
  // Creates fake data and message objects
  const data: ExpirationCompleteEvent["data"] = {
    orderId: order.id,
  };
  // Only need ack function and Message type for testing, so the type error should be ignored this once
  // @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };

  return { listener, data, message };
};

it("Cancels order upon receiving an expiration:complete event", async () => {
  const { listener, data, message } = await init();

  // Call onMessage function
  await listener.onMessage(data, message);
  // Assert order was correctly modified
  const order = await Order.findById(data.orderId);
  expect(order).toBeDefined();
  expect(order!.status).toEqual(OrderStatus.Cancelled);
});

it("Publishes an order:cancelled event", async () => {
  const { listener, data, message } = await init();

  // Call onMessage function
  await listener.onMessage(data, message);
  // Assert publish method is being called
  expect(natsWrapper.client.publish).toHaveBeenCalled();
  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );
  expect(eventData.id).toEqual(data.orderId);
});

it("Acks the message", async () => {
  const { listener, data, message } = await init();

  // Call onMessage function
  await listener.onMessage(data, message);
  // Assert message.ack was called
  expect(message.ack).toHaveBeenCalled();
});
