import { Schema, model } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  orders: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    default: [],
  },
  role: {
    type: String,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default model("User", userSchema);
