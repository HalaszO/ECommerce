import mongoose from "mongoose";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  BadRequestError,
  OrderStatus,
  requireAuth,
  ResourceNotFoundError,
  validateRequest,
} from "@ohalaszdev/common";
import { Item } from "../models/item";
import { Order } from "../models/order";
import { OrderCreatedPublisher } from "./../events/publishers/OrderCreatedPublisher";
import { natsWrapper } from "../natsWrapper";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60; // 15 minutes

router.post(
  "/api/orders",
  requireAuth,
  [
    body("itemId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("itemId must be a valid ID"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { itemId } = req.body;

    // Get the item from the DB
    const item = await Item.findById(itemId);
    if (!item) {
      throw new ResourceNotFoundError();
    }

    // Reserve item
    const isItemReserved = await item.isReserved();
    console.log(`Item reserved status: ${isItemReserved}`);
    if (isItemReserved) {
      throw new BadRequestError("Item already reserved, cannot initiate order");
    }

    // Build and save the order to the DB
    const expiration = new Date(); // now
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS); // 15 minutes
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      item,
    });
    await order.save();

    // Publish the event of order:created
    // Response is not dependent on the result/success of publishing
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      version: order.version,
      item: {
        id: item.id,
        price: item.price,
      },
    });

    res.status(201).send(order);
  }
);

export { router as createOrderRouter };
