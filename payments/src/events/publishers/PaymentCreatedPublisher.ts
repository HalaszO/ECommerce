import { PaymentCreatedEvent, Publisher, Subjects } from "@ohalaszdev/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
