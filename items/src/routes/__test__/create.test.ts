import { natsWrapper } from "./../../natsWrapper";
import request from "supertest";
import app from "../../app";
import { Item } from "../../models/item";

it("has a route handler listening to api/items for post requests", async () => {
  const response = await request(app).post("/api/items").send({});

  expect(response.status).not.toEqual(404);
});
it("can only be accessed if user is signed in", async () => {
  await request(app).post("/api/items").send({}).expect(401);
});
it("returns a status other than 401 if the user is signed in", async () => {
  const response = await request(app)
    .post("/api/items")
    .set("Cookie", global.signin())
    .send({});
  expect(response.status).not.toEqual(401);
});

it("returns an error if invalid title is provided", async () => {
  await request(app)
    .post("/api/items")
    .set("Cookie", global.signin())
    .send({
      title: "",
      price: 42,
    })
    .expect(400);

  await request(app)
    .post("/api/items")
    .set("Cookie", global.signin())
    .send({
      price: 42,
    })
    .expect(400);
});
it("returns an error if invalid price is provided", async () => {
  await request(app)
    .post("/api/items")
    .set("Cookie", global.signin())
    .send({
      title: "Waffle maker",
      price: -10,
    })
    .expect(400);

  await request(app)
    .post("/api/items")
    .set("Cookie", global.signin())
    .send({
      title: "Waffle maker",
    })
    .expect(400);
});

it("creates an item with valid inputs", async () => {
  let items = await Item.find({});
  // DB is cleaned before each test
  expect(items.length).toEqual(0);
  const title = "Waffle maker";
  const price = 42;

  await request(app)
    .post("/api/items")
    .set("Cookie", global.signin())
    .send({
      title,
      price,
    })
    .expect(201);

  items = await Item.find({});
  expect(items.length).toEqual(1);
  expect(items[0].price).toEqual(price);
  expect(items[0].title).toEqual(title);
});

it("publishes an event", async () => {
  const title = "Waffle maker";
  const price = 42;

  await request(app)
    .post("/api/items")
    .set("Cookie", global.signin())
    .send({
      title,
      price,
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
