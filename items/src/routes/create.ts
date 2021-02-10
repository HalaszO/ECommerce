import { natsWrapper } from "./../natsWrapper";
import { ItemCreatedPublisher } from "./../events/publishers/ItemCreatedPublisher";
import express, { Request, Response } from "express";
7;
import { body } from "express-validator";

import { requireAuth, validateRequest } from "@ohalaszdev/common";
import { Item } from "../models/item";

const router = express.Router();

router.post(
  "/api/items",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("A valid title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than zero"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const item = Item.build({
      title,
      price,
      userId: req.currentUser!.id,
    });
    // If currentuser were undefined, this block would not be reached
    // Thanks to the auth & validation middleware
    await item.save();

    await new ItemCreatedPublisher(natsWrapper.client).publish({
      id: item.id,
      title: item.title,
      price: item.price,
      userId: item.userId,
    });

    res.status(201).send(item);
  }
);

export { router as createItemRouter };
