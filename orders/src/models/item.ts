import mongoose from "mongoose";
import { Order, OrderStatus } from "./order";
import { DOCUMENT_VERSION_INCREMENT } from "./versionIncrement";

interface ItemAttrs {
  id: string;
  title: string;
  price: number;
}

interface ItemDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

interface ItemModel extends mongoose.Model<ItemDoc> {
  build(attrs: ItemAttrs): ItemDoc;
  findByEvent(event: { id: string; version: number }): Promise<ItemDoc | null>;
}

const itemSchema = new mongoose.Schema<ItemDoc, ItemModel>(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
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
// setting version key from '__v' to 'version'
itemSchema.set("versionKey", "version");

// Custom pre-save hook
// Modifying mongoose-mongoDB query for saving so the version number is checked as well
// (querying for the document version minus the increment)
itemSchema.pre("save", function (done) {
  this.$where = {
    version: this.get("version") - DOCUMENT_VERSION_INCREMENT,
  };
  done();
});

// Custom mongoose query to find the document based on the event data
itemSchema.statics.findByEvent = async (event: {
  id: string;
  version: number;
}) => {
  return Item.findOne({
    _id: event.id,
    version: event.version - DOCUMENT_VERSION_INCREMENT,
  });
};

// Custom build method for parameter compatibility checking
itemSchema.statics.build = (attrs: ItemAttrs) => {
  return new Item({ _id: attrs.id, title: attrs.title, price: attrs.price });
};

itemSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    item: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Completed,
      ],
    },
  });
  return !!existingOrder; // boolean conversion
};

const Item = mongoose.model<ItemDoc, ItemModel>("Item", itemSchema);

export { Item, ItemDoc, DOCUMENT_VERSION_INCREMENT };
