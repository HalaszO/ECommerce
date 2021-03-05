import { OrderUpdatedEvent, Publisher, Subjects } from "@ohalaszdev/common";

export class ItemUpdatedPublisher extends Publisher<OrderUpdatedEvent> {
  readonly subject = Subjects.OrderUpdated;
}
