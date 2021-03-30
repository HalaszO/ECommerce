import { BadRequestError } from "@ohalaszdev/common";
import express, { Request, Response } from "express";
import { isValidObjectId, ObjectId } from "mongoose";
import { Item } from "../models/item";
const router = express.Router();

router.get("/api/items", async (req: Request, res: Response) => {
  let items = [];
  if (req.query.user) {
    // Get items for a user
    const userId = req.query.user as string;
    // invalid userId: throw error
    if (!isValidObjectId(userId)) {
      throw new BadRequestError("Invalid userId");
    }
    items = await Item.find({ userId });
  } else {
    // No query param: get all items
    items = await Item.find({});
  }
  res.send(items);
});

export { router as getAllItemsRouter };
