import request from "supertest";
import app from "../../app";
import { Item } from "../../models/item";
import mongoose from "mongoose";

const createItems = async () => {
  // creating test items in the DB
  const userOne = new mongoose.Types.ObjectId().toHexString();
  const userTwo = new mongoose.Types.ObjectId().toHexString();

  const itemOne = Item.build({
    title: "Waffle maker",
    price: 49,
    userId: userOne,
  });
  await itemOne.save();

  const itemTwo = Item.build({
    title: "Cozy blanket",
    price: 29,
    userId: userOne,
  });
  await itemTwo.save();

  const itemThree = Item.build({
    title: "Glass vase",
    price: 25,
    userId: userTwo,
  });
  await itemThree.save();
  return { userOne, userTwo };
};

it("returns the list of items", async () => {
  await createItems();
  const response = await request(app).get("/api/items").send().expect(200);
  expect(response.body.length).toEqual(3);
});

it("returns the items belonging to the user, if specified", async () => {
  const { userOne } = await createItems();
  const response = await request(app)
    .get(`/api/items?user=${userOne}`)
    .send()
    .expect(200);
  expect(response.body.length).toEqual(2);
  expect(response.body[0].userId).toEqual(userOne);
  expect(response.body[1].userId).toEqual(userOne);
});

it("returns a 400 if an invalid userId is provided", async () => {
  const response = await request(app)
    .get(`/api/items?user=invalid`)
    .send()
    .expect(400);
});
