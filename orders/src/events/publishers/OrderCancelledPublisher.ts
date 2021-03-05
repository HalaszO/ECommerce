import { OrderCancelledEvent, Publisher, Subjects } from "@ohalaszdev/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
