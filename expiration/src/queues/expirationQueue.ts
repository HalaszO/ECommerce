import { ExpirationCompletePublisher } from "./../events/publishers/ExpirationCompletePublisher";
import Queue from "bull";
import { natsWrapper } from "../natsWrapper";

interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>("order:expiration", {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async (job) => {
  new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId,
  });
  console.log(`Expiration job processed, orderId: ${job.data.orderId}`);
});

export { expirationQueue };
