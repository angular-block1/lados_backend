import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productShema = mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    price: {
      type: Number,
      require: true,
    },
  },
  { timestamps: true }
);

productShema.plugin(mongoosePaginate);
export default mongoose.model("Product", productShema);
