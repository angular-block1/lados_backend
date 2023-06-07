import { Schema, model, plugin } from "mongoose";

const cateproductShema = new Schema(
  {
    name: {
      type: String,
    },
    slug: {
      type: String,
    },
    products: {
      type: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
      }],
      default: []
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
  { timestamps: true, collection: 'categories' }
);

export default model("Category", cateproductShema);