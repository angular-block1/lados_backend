import mongoose from "mongoose";
const cateproductShema = mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    products: [{ type: mongoose.Types.ObjectId, ref: "Products" }],
    image: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);
export default mongoose.model("Categories", cateproductShema);