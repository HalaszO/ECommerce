import mongoose from "mongoose";
import request from "supertest";
import app from "../../app";
import { Item } from "../../models/item";

it("returns 404 if item is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/items/${id}`).send().expect(404);
});

it("returns item if found", async () => {
  // Creating document in DB
  const title = "Waffle maker";
  const price = 42;
  const userId = "4555gsgf464553";
  const item = Item.build({
    title,
    price,
    userId,
  });
  await item.save();
  const itemDoc = await Item.findOne({ title });
  const itemId = itemDoc!.id; // '_id' transformed into 'id' via the impelmented toJSON function
  const response = await request(app)
    .get(`/api/items/${itemId}`)
    .send()
    .expect(200);
  // Checking response content
  expect(response.body.title).toEqual(title);
  expect(response.body.price).toEqual(price);
  expect(response.body.userId).toEqual(userId);
});
