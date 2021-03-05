import mongoose from "mongoose";
import { natsWrapper } from "../../natsWrapper";
import request from "supertest";
import app from "../../app";
import { Order, OrderStatus } from "../../models/order";
import { Item } from "../../models/item";

const createItem = async ({
  title,
  price,
}: {
  title: string;
  price: number;
}) => {
  // creating 3 items in the DB
  const item = Item.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title,
    price,
  });
  await item.save();
  return item;
};

it("fetches orders for a particular user", async () => {
  const itemOne = await createItem({ title: "Waffle maker", price: 49 });
  const itemTwo = await createItem({ title: "Coffee table", price: 75 });
  const itemThree = await createItem({
    title: "Toyota corolla E140",
    price: 3200,
  });

  const userOne = global.signin();
  const userTwo = global.signin();

  await request(app)
    .post("/api/orders")
    .set("Cookie", userOne)
    .send({ itemId: itemOne.id })
    .expect(201);
  const { body: orderOne } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({ itemId: itemTwo.id })
    .expect(201);
  const { body: orderTwo } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({ itemId: itemThree.id })
    .expect(201);

  const response = await request(app)
    .get("/api/orders")
    .set("Cookie", userTwo)
    .send()
    .expect(200);

  //Checking length and if the correct orders were returned
  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(orderOne.id);
  expect(response.body[1].id).toEqual(orderTwo.id);
  expect(response.body[0].item.id).toEqual(itemTwo.id);
  expect(response.body[1].item.id).toEqual(itemThree.id);
});
