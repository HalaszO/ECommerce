import { DOCUMENT_VERSION_INCREMENT, Item } from "../item";
import mongoose from "mongoose";

it("implements optimistic concurrency control", async (done) => {
  // Creates an item
  const item = Item.build({
    title: "waffle maker",
    price: 50,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });

  // Save item to DB
  await item.save();

  // Fetch item twice
  const firstInstance = await Item.findById(item.id);
  const secondInstance = await Item.findById(item.id);
  // Make changes separately
  firstInstance!.set({
    price: 40,
    version: firstInstance!.version + DOCUMENT_VERSION_INCREMENT,
  });
  secondInstance!.set({
    price: 30,
    version: secondInstance!.version + DOCUMENT_VERSION_INCREMENT,
  });
  // Save 1st item
  await firstInstance!.save();
  // Save 2nd item
  try {
    await secondInstance!.save();
  } catch (err) {
    return done();
  }
  throw new Error("Should have thrown error and returned before this point");
});

it("increments the version number upon multiple saves", async () => {
  const item = Item.build({
    title: "waffle maker",
    price: 60,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });
  await item.save();

  const itemOne = await Item.findById(item.id);
  itemOne!.set({
    price: 55,
    version: itemOne!.version + DOCUMENT_VERSION_INCREMENT,
  });
  await itemOne!.save();

  const itemTwo = await Item.findById(item.id);
  itemTwo!.set({
    price: 50,
    version: itemTwo!.version + DOCUMENT_VERSION_INCREMENT,
  });
  await itemTwo!.save();

  expect(itemTwo!.version).toEqual(
    itemOne!.version + DOCUMENT_VERSION_INCREMENT
  );
});
