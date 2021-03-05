import mongoose from "mongoose";
import { natsWrapper } from "./../../natsWrapper";
import request from "supertest";
import app from "../../app";
import { Order, OrderStatus } from "../../models/order";
import { Item } from "../../models/item";

it("has a route handler listening to api/orders for post requests", async () => {
  const response = await request(app).post("/api/orders").send({});

  expect(response.status).not.toEqual(404);
});

it("can only be accessed if user is signed in", async () => {
  await request(app).post("/api/orders").send({}).expect(401);
});

it("returns a status other than 401 if the user is signed in", async () => {
  const response = await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({});
  expect(response.status).not.toEqual(401);
});

it("returns an error if the item does not exist", async () => {
  const itemId = new mongoose.Types.ObjectId();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ itemId })
    .expect(404);
});

it("returns an error if the item is already reserved", async () => {
  const item = Item.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Vase",
    price: 50,
  });
  await item.save();

  const expiresAt = new Date(); // now
  expiresAt.setSeconds(expiresAt.getSeconds() + 30 * 60);
  const order = Order.build({
    item,
    userId: "dummy",
    status: OrderStatus.Created,
    expiresAt,
  });
  await order.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ itemId: item.id })
    .expect(400);
});

it("reserves the item", async () => {
  const item = Item.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Vase",
    price: 50,
  });
  await item.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ itemId: item.id })
    .expect(201);
});

it("publishes event upon creating an order", async () => {
  const item = Item.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Vase",
    price: 50,
  });
  await item.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ itemId: item.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
