import request from "supertest";
import app from "../../app";

it("returns a 201 on successful signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "p455w0rd",
    })
    .expect(201);
});

it("returns a 400 on invalid email", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test.com",
      password: "p455w0rd",
    })
    .expect(400);
});

it("returns a 400 on invalid password", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "p",
    })
    .expect(400);
});

it("returns a 400 on missing credentials", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com" })
    .expect(400);
  return request(app)
    .post("/api/users/signup")
    .send({ password: "p455w0rd" })
    .expect(400);
});

it("disallows duplicate emails", async () => {
  await request(app).post("api/users/signup").send({
    email: "test@test.com",
    password: "p455w0rd",
  });
  expect(201);

  await request(app).post("api/users/signup").send({
    email: "test@test.com",
    password: "p455w0rd",
  });
  expect(400);
});

it("Sets a cookie following a successful signup", async () => {
  const response = await request(app)
    .post("api/users/signup")
    .send({
      email: "test@test.com",
      password: "p455w0rd",
    })
    .expect(201);
  expect(response.get("Set-Cookie")).toBeDefined();
});
