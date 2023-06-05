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
    quantity: {
      type: Number,
      require: true,
    },
    size: {
      type: [String],
      require: true,
    },
    colors: {
      type: [String],
      require: true,
    },
    images:[String],
    description:{
      type: String,
      require: true,
    },
    status:{
      type: Boolean,
      default: true,
    },
    categoryId:{
      type:mongoose.Types.ObjectId,
      ref:'Categories'
    }
  },
  { timestamps: true }
);

productShema.plugin(mongoosePaginate);
export default mongoose.model("Product", productShema);
