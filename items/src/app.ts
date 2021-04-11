import express from "express";
import { json } from "body-parser";
import "express-async-errors";
import cookieSession from "cookie-session";

import {
  errorHandler,
  ResourceNotFoundError,
  currentUser,
} from "@ohalaszdev/common";
import { createItemRouter } from "./routes/create";
import { getItemRouter } from "./routes/get";
import { getAllItemsRouter } from "./routes/getAll";
import { updateItemRouter } from "./routes/update";

const app = express();
app.set("trust proxy", true); // To enable proxied traffic via nginx
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(currentUser);

app.use(createItemRouter);
app.use(getItemRouter);
app.use(getAllItemsRouter);
app.use(updateItemRouter);

// Invalid route
app.all("*", async (req, res) => {
  throw new ResourceNotFoundError();
});

app.use(errorHandler);

export default app;
