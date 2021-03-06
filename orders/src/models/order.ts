import mongoose from "mongoose";
import { OrderStatus } from "@ohalaszdev/common";
import { ItemDoc } from "./item";
import { DOCUMENT_VERSION_INCREMENT } from "./versionIncrement";
// Re-exporting
export { OrderStatus, DOCUMENT_VERSION_INCREMENT };

interface OrderAttrs {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  item: ItemDoc;
}

interface OrderDoc extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  item: ItemDoc;
  version: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
  findByEvent(data: { id: string; version: number }): Promise<OrderDoc | null>;
}

const orderSchema = new mongoose.Schema<OrderDoc, OrderModel>(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
      required: false,
    },
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

orderSchema.set("versionKey", "version");

// Custom pre-save hook
// Modifying mongoose -> mongoDB query for saving so the version number is checked as well
// (querying for the document version minus the increment)
orderSchema.pre("save", function (done) {
  this.$where = {
    version: this.get("version") - DOCUMENT_VERSION_INCREMENT,
  };
  done();
});

// Custom mongoose query to find the document based on the event data
orderSchema.statics.findByEvent = async (event: {
  id: string;
  version: number;
}) => {
  return Order.findOne({
    _id: event.id,
    version: event.version - DOCUMENT_VERSION_INCREMENT,
  });
};

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };
