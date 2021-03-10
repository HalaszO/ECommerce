import mongoose from "mongoose";
import {
  NotAuthorizedError,
  OrderStatus,
  requireAuth,
  ResourceNotFoundError,
  validateRequest,
} from "@ohalaszdev/common";
import express, { Request, Response } from "express";
import { param } from "express-validator";
import { DOCUMENT_VERSION_INCREMENT, Order } from "../models/order";
import { OrderCancelledPublisher } from "../events/publishers/OrderCancelledPublisher";
import { natsWrapper } from "../natsWrapper";

const router = express.Router();

router.patch(
  "/api/orders/:orderId",
  requireAuth,
  [
    // Validating orderId param
    param("orderId")
      .isMongoId()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("orderId must be a valid ID"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate("item");

    // Checking if order exists and belongs to the currentuser
    if (!order) {
      throw new ResourceNotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    order.set({
      status: OrderStatus.Cancelled,
      expiresAt: new Date(), // now
      version: order.version + DOCUMENT_VERSION_INCREMENT, // increment version number
    });
    // To-do: graceful handling of version clashes upon multiple "cancel" calls at the same time?
    // Is it needed?

    await order.save();

    // Publishing order:cancelled event
    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      userId: order.userId,
      version: order.version,
      item: {
        id: order.item.id,
      },
    });

    res.send();
  }
);

export { router as cancelOrderRouter };
