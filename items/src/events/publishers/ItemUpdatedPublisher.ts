import { ItemUpdatedEvent, Publisher, Subjects } from "@ohalaszdev/common";

export class ItemUpdatedPublisher extends Publisher<ItemUpdatedEvent> {
  readonly subject = Subjects.ItemUpdated;
}
