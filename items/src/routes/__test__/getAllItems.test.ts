import request from "supertest";
import app from "../../app";
import { Item } from "../../models/item";

const createItems = async () => {
  // creating 3 items in the DB
  let title = "Waffle maker";
  let price = 49;
  let userId = "4555gsgf464553";
  let item = Item.build({
    title,
    price,
    userId,
  });
  await item.save();

  title = "Cozy blanket";
  price = 29;
  userId = "d54hd8d84hd354534";
  item = Item.build({ title, price, userId });
  await item.save();

  title = "Glass vase";
  price = 25;
  userId = "mff545444844fsf684";
  item = Item.build({ title, price, userId });
  await item.save();
};

it("returns the list of items", async () => {
  await createItems();
  const response = await request(app).get("/api/items").send().expect(200);
  expect(response.body.length).toEqual(3);
});
