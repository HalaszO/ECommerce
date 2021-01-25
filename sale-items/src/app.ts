import express from "express";
import { json } from "body-parser";
import "express-async-errors";
import cookieSession from "cookie-session";

import { currentuserRouter } from "./routes/currentUser";
import { signinRouter } from "./routes/signin";
import { signupRouter } from "./routes/signup";
import { signoutRouter } from "./routes/signout";
import { errorHandler } from "./middlewares/errorHandler";
import RouteNotfoundError from "./classes/errors/RouteNotFoundError";

const app = express();
app.set("trust proxy", true); // To enable proxied traffic via nginx
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(currentuserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

// Invalid route
app.all("*", async (req, res) => {
  throw new RouteNotfoundError();
});

app.use(errorHandler);

export default app;
