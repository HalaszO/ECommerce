import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  ResourceNotFoundError,
  NotAuthorizedError,
  OrderStatus,
} from "@ohalaszdev/common";
import { Order } from "../models/order";
import { stripe } from "../stripe";
import { Payment } from "../models/payment";
import { PaymentCreatedPublisher } from "../events/publishers/PaymentCreatedPublisher";
import { natsWrapper } from "../natsWrapper";

const router = express.Router();

router.post(
  "/api/payments",
  requireAuth,
  [body("token").not().isEmpty(), body("orderId").not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      throw new ResourceNotFoundError();
    }
    // Currentuser is defined since auth has passed
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError(
        "Order was cancelled before it could be paid for"
      );
    }

    const charge = await stripe.charges.create({
      currency: "eur",
      amount: order.price * 100,
      source: token,
    });
    const payment = await Payment.build({
      orderId,
      stripeId: charge.id,
    });
    await payment.save();

    new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId,
      stripeId: charge.id,
    });

    res.status(201).send({ paymentId: payment.id, success: true });
  }
);

export { router as CreateChargeRouter };
