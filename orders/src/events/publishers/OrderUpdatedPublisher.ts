import { OrderUpdatedEvent, Publisher, Subjects } from "@ohalaszdev/common";

export class OrderUpdatedPublisher extends Publisher<OrderUpdatedEvent> {
  readonly subject = Subjects.OrderUpdated;
}
