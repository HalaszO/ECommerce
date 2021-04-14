import express from "express";
import { json } from "body-parser";
import "express-async-errors";
import cookieSession from "cookie-session";

import { currentUserRouter } from "./routes/currentUser";
import { signinRouter } from "./routes/signin";
import { signupRouter } from "./routes/signup";
import { signoutRouter } from "./routes/signout";
import { errorHandler, ResourceNotFoundError } from "@ohalaszdev/common";

const app = express();
app.set("trust proxy", true); // To enable proxied traffic via nginx
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false, //process.env.NODE_ENV !== "test",
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

// Defaulting to invalid route
app.all("*", async (req, res) => {
  throw new ResourceNotFoundError();
});

app.use(errorHandler);

export default app;
