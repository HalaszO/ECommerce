import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import app from "../app";
import request from "supertest";

declare global {
  namespace NodeJS {
    interface Global {
      signup(): Promise<string>;
    }
  }
}

let mongo: MongoMemoryServer;

beforeAll(async () => {
  process.env.JWT_KEY = "fakeKey";

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  collections.forEach(async (collection) => {
    await collection.deleteMany({});
  });
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

// global function for convenience
global.signup = async () => {
  const email = "test@test.com";
  const password = "p455w0rd";
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "p455w0rd",
    })
    .expect(201);
  const cookie = response.get("Set-Coookie");
  return cookie;
};
