import express from "express";
import { json } from "body-parser";
import "express-async-errors";
import cookieSession from "cookie-session";

import {
  errorHandler,
  ResourceNotFoundError,
  currentUser,
} from "@ohalaszdev/common";
import { CreateChargeRouter } from "./routes/create";

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

app.use(CreateChargeRouter);

// Invalid route
app.all("*", async (req, res) => {
  throw new ResourceNotFoundError();
});

app.use(errorHandler);

export default app;
