import { OrderStatus } from "@ohalaszdev/common";
import mongoose from "mongoose";
import { DOCUMENT_VERSION_INCREMENT } from "./versionIncrement";
// Re-exporting
export { OrderStatus, DOCUMENT_VERSION_INCREMENT };

interface OrderAttrs {
  id: string;
  status: OrderStatus;
  price: number;
  userId: string;
}

interface OrderDoc extends mongoose.Document {
  id: string;
  status: OrderStatus;
  price: number;
  userId: string;

  version: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema<OrderDoc, OrderModel>(
  {
    id: {
      type: String,
      required: true,
    },
    status: {
      type: OrderStatus,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
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

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({
    _id: attrs.id,
    status: attrs.status,
    price: attrs.price,
    userId: attrs.userId,
  });
};

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };
