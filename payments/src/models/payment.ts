import mongoose from "mongoose";
import { DOCUMENT_VERSION_INCREMENT } from "./versionIncrement";
// Re-exporting
export { DOCUMENT_VERSION_INCREMENT };

interface PaymentAttrs {
  orderId: string;
  stripeId: string;
}

interface PaymentDoc extends mongoose.Document {
  orderId: string;
  stripeId: string;
  version: number;
}

interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(attrs: PaymentAttrs): PaymentDoc;
}

const PaymentSchema = new mongoose.Schema<PaymentDoc, PaymentModel>(
  {
    orderId: {
      type: String,
      required: true,
    },
    stripeId: {
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

PaymentSchema.set("versionKey", "version");

// Custom pre-save hook
// Modifying mongoose -> mongoDB query for saving so the version number is checked as well
// (querying for the document version minus the increment)
PaymentSchema.pre("save", function (done) {
  this.$where = {
    version: this.get("version") - DOCUMENT_VERSION_INCREMENT,
  };
  done();
});

PaymentSchema.statics.build = (attrs: PaymentAttrs) => {
  return new Payment(attrs);
};

const Payment = mongoose.model<PaymentDoc, PaymentModel>(
  "Payment",
  PaymentSchema
);

export { Payment };
