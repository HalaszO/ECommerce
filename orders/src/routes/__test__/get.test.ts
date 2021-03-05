import mongoose from "mongoose";
import { natsWrapper } from "../../natsWrapper";
import request from "supertest";
import app from "../../app";
import { Order, OrderStatus } from "../../models/order";
import { Item } from "../../models/item";

it("fetches the order", async () => {
  // create item
  const item = Item.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Vase",
    price: 50,
  });
  await item.save();

  const user = global.signin();
  // make request to create order with this item
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ itemId: item.id })
    .expect(201);

  // make request to fetch order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});

it("returns 404 requesting a non-existent order", async () => {
  const orderId = mongoose.Types.ObjectId().toHexString();
  await request(app)
    .get(`/api/orders/${orderId}`)
    .set("Cookie", global.signin())
    .send()
    .expect(404);
});

it("returns 400 requesting an order with an invalid id in the url", async () => {
  const orderId = "invalidId";
  await request(app)
    .get(`/api/orders/${orderId}`)
    .set("Cookie", global.signin())
    .send()
    .expect(400);
});

it("returns 401 requesting an order not belonging to the current user", async () => {
  const userOne = global.signin();
  const userTwo = global.signin();

  const item = Item.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Vase",
    price: 50,
  });
  await item.save();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", userOne)
    .send({ itemId: item.id })
    .expect(201);

  await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", userTwo)
    .send()
    .expect(401);
});
