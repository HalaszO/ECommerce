import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import app from "../app";
import request from "supertest";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

declare global {
  namespace NodeJS {
    interface Global {
      signin(id?: string): Array<string>;
    }
  }
}

// Load .env with Stripe test-API key as soon as possible
// This key should not be stored in a repository
config();

// Use the mock nats server instance for testing
jest.mock("../natsWrapper");

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
  jest.clearAllMocks();
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
global.signin = (id?: string) => {
  // Build TWT payload  {id, email}
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: "fake@test.com",
  };
  // Create JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  // Build session object { jwt: JWT}
  const sessionJSON = JSON.stringify({ jwt: token });
  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString("base64");
  // Build cookie and return it
  return [`express:sess=${base64}`];
};
