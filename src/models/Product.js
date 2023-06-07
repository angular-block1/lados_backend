import { Schema, model, plugin } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productShema = new Schema(
  {
    name: {
      type: String,
    },
    slug: {
      type: String,
      required: true
    },
    price: {
      type: Number,
    },
    stock: {
      type: Number,
    },
    status: {
      type: Boolean,
      default: true,
    },
    images: [String],
    description: {
      type: String,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category"
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true, collection: "products" }
);

productShema.plugin(mongoosePaginate);
export default model("Product", productShema);
