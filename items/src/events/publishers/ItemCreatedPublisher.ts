import { ItemCreatedEvent, Publisher, Subjects } from "@ohalaszdev/common";

export class ItemCreatedPublisher extends Publisher<ItemCreatedEvent> {
  readonly subject = Subjects.ItemCreated;
}
