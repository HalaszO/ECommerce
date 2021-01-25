import request from "supertest";
import app from "../../app";

it("fails when non-registered email is supplied", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "p455w0rd",
    })
    .expect(400);
});

it("fails when an incorrect password is supplied", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "p455w0rd",
    })
    .expect(201);
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "incorrectPassword",
    })
    .expect(400);
});

it("responds with a cookie following a valid login", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "p455w0rd",
    })
    .expect(201);
  const response = await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "p455w0rd",
    })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});
