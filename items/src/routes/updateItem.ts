import { natsWrapper } from "./../natsWrapper";
import { ItemUpdatedPublisher } from "./../events/publishers/ItemUpdatedPublisher";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  validateRequest,
  ResourceNotFoundError,
  requireAuth,
  NotAuthorizedError,
} from "@ohalaszdev/common";
import { Item } from "../models/item";

const router = express.Router();

router.put(
  "/api/items/:id",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Invalid title"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than zero"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const item = await Item.findById(req.params.id);

    if (!item) {
      throw new ResourceNotFoundError();
    }

    if (item.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    item.set({
      title: req.body.title,
      price: req.body.price,
    });

    await item.save();

    new ItemUpdatedPublisher(natsWrapper.client).publish({
      id: item.id,
      title: item.title,
      price: item.price,
      userId: item.userId,
    });

    res.send(item);
  }
);

export { router as updateItemRouter };
