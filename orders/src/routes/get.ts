import mongoose from "mongoose";
import {
  NotAuthorizedError,
  requireAuth,
  ResourceNotFoundError,
  validateRequest,
} from "@ohalaszdev/common";
import express, { Request, Response } from "express";
import { param } from "express-validator";
import { Order } from "../models/order";

const router = express.Router();

router.get(
  "/api/orders/:orderId",
  requireAuth,
  [
    param("orderId")
      .isMongoId()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("orderId must be a valid ID"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate("item");

    if (!order) {
      throw new ResourceNotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    res.send(order);
  }
);

export { router as getOrderRouter };
