import express, { Request, Response } from "express";
import { Item } from "../models/item";
import { ResourceNotFoundError } from "@ohalaszdev/common";

const router = express.Router();

router.get("/api/items/:id", async (req: Request, res: Response) => {
  const item = await Item.findById(req.params.id);

  if (!item) {
    throw new ResourceNotFoundError();
  }

  res.send(item);
});

export { router as getItemRouter };
