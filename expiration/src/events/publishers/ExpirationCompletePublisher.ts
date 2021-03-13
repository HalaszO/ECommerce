import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from "@ohalaszdev/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
