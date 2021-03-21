import mongoose from "mongoose";
import request from "supertest";
import app from "../../app";
import { Order, OrderStatus } from "../../models/order";
import { stripe } from "../../stripe";

//jest.mock("../../stripe");

it("Returns a 404 if the order is not found", async () => {
  await request(app)
    .post("/api/signin")
    .set("Cookie", global.signin())
    .send({
      token: "token",
      orderId: mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it("Returns a 401 when trying to purchase an order not belonging to the user", async () => {
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: 50,
    userId: mongoose.Types.ObjectId().toHexString(),
  });
  await order.save();
  // generated userIds will differ
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({ token: "token", orderId: order.id })
    .expect(401);
});

it("Returns a 400 when trying to purchase a cancelled order", async () => {
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Cancelled,
    price: 50,
    userId: mongoose.Types.ObjectId().toHexString(),
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(order.userId))
    .send({ token: "token", orderId: order.id })
    .expect(400);
});

it("Creates a charge using stripe", async () => {
  const price = Math.floor(Math.random() * 1000000);
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price,
    userId: mongoose.Types.ObjectId().toHexString(),
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(order.userId))
    .send({ token: "tok_visa", orderId: order.id })
    .expect(201);

  const charges = await stripe.charges.list({ limit: 50 });
  const createdCharge = charges.data.find((charge) => {
    return charge.amount === price * 100; // 100 multiplier for stripe (smallest currency unit policy)
  });
  expect(createdCharge).toBeDefined();
  expect(createdCharge!.currency).toEqual("eur");
});
