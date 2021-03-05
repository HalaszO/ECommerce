import { requireAuth } from "@ohalaszdev/common";
import express, { Request, Response } from "express";
import { Order } from "../models/order";

const router = express.Router();

router.get("/api/orders", requireAuth, async (req: Request, res: Response) => {
  const orders = await Order.find({ userId: req.currentUser!.id }).populate(
    "item"
  );
  res.send(orders);
});

export { router as getAllOrdersRouter };
