import { natsWrapper } from "./../../natsWrapper";
import request from "supertest";
import app from "../../app";
import mongoose from "mongoose";
import { DOCUMENT_VERSION_INCREMENT, Item } from "../../models/item";

jest.mock("../../natsWrapper");

const createItem = async () => {
  const title = "Waffle maker";
  const price = 49;
  const userId = "0fakeId0";
  const item = Item.build({
    title,
    price,
    userId,
  });
  await item.save();

  const itemDoc = await Item.findOne({ title });

  return itemDoc!.id as string;
};

it("returns 404 if item with id does not exist", async () => {
  // Generating valid, but non-existent document id
  const id = mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/items/${id}`)
    .set("Cookie", global.signin())
    .send({
      title: "bhshhtmmhr",
      price: 42,
    });
  expect(404);
});

it("returns 401 if user is not authenticated", async () => {
  const id = await createItem();

  await request(app).put(`/api/items/${id}`).send({
    title: "bhshhtmmhr",
    price: 42,
  });
  expect(401);
});

it("returns 401 if item does not belong to current user", async () => {
  const id = await createItem();

  await request(app)
    .put(`/api/items/${id}`)
    .set("Cookie", global.signin())
    .send({
      title: "Waffle maker",
      price: 39,
    })
    .expect(401);
});

it("returns 400 if invalid item attributes are provided", async () => {
  const id = await createItem();

  await request(app)
    .put(`/api/items/${id}`)
    .set("Cookie", global.signin())
    .send({
      title: "",
      price: 39,
    })
    .expect(400);

  await request(app)
    .put(`/api/items/${id}`)
    .set("Cookie", global.signin())
    .send({
      title: "Waffle maker",
    })
    .expect(400);
});

it("updates the item if valid attributes are provided", async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post("/api/items")
    .set("Cookie", cookie)
    .send({
      title: "Waffle maker",
      price: 49,
    });
  const newTitle = "Waffle maker and contact grill";
  const newPrice = 69;
  await request(app)
    .put(`/api/items/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: newTitle,
      price: newPrice,
    })
    .expect(200);

  const itemResponse = await request(app)
    .get(`/api/items/${response.body.id}`)
    .send();
  expect(itemResponse.body.title).toEqual(newTitle);
  expect(itemResponse.body.price).toEqual(newPrice);
});

it("Will not allow updates if item has on order on it", async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post("/api/items")
    .set("Cookie", cookie)
    .send({
      title: "Waffle maker",
      price: 49,
    });

  // Adding an orderId to item
  const item = await Item.findById(response.body.id);
  item!.set({
    orderId: mongoose.Types.ObjectId().toHexString(),
    version: item!.version + DOCUMENT_VERSION_INCREMENT,
  });
  await item!.save();

  const newTitle = "Waffle maker and contact grill";
  const newPrice = 69;
  await request(app)
    .put(`/api/items/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: newTitle,
      price: newPrice,
    })
    .expect(400);
});

it("publishes event on update", async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post("/api/items")
    .set("Cookie", cookie)
    .send({
      title: "Waffle maker",
      price: 49,
    });
  const newTitle = "Waffle maker and contact grill";
  const newPrice = 69;
  await request(app)
    .put(`/api/items/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: newTitle,
      price: newPrice,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
