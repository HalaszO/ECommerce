import mongoose from "mongoose";
import { DOCUMENT_VERSION_INCREMENT } from "./versionIncrement";
export { DOCUMENT_VERSION_INCREMENT };

interface ItemAttrs {
  title: string;
  price: number;
  userId: string;
}

interface ItemDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  version: number;
  orderId?: string;
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
    },
    userId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
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

itemSchema.set("versionKey", "version");
// Custom pre-save hook
// Modifying mongoose-mongoDB query for saving so the version number is checked as well
// (querying for the document version minus the increment)
itemSchema.pre("save", function (done) {
  //(this.version += DOCUMENT_VERSION_INCREMENT),
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

itemSchema.statics.build = (attrs: ItemAttrs) => {
  return new Item(attrs);
};

const Item = mongoose.model<ItemDoc, ItemModel>("Item", itemSchema);

export { Item };
