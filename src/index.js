import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

import product from "./router/Product.js";
import category from "./router/Categories.js";
import auth from "./router/Auth.js";
import order from "./router/Order.js";
import uploadImageRouter from "./router/upload.js";

dotenv.config();
const app = express();
const port = 4000;
const corsOptions = {
  origin: true,
  credentials: true,
};

app.get("/api", (req, res) => {
  res.send("api working");
});

mongoose.set("strictQuery", false);
const connect = async () => {
  try {
    await mongoose.connect("mongodb+srv://toan:toan123@cluster0.kyvk2ap.mongodb.net/?retryWrites=true&w=majority", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("mongodb connect successful");
  } catch (err) {
    console.log(err);
  }
};

// middleware
app.use(express.json());
app.use(cors(corsOptions));

app.use("/api/products", product);
app.use("/api/categories", category);
app.use("/api/auth", auth);
app.use("/api/order", order);
app.use("/api/upload", uploadImageRouter);

app.listen(port, () => {
  connect();
  console.log("server listening on port", port);
});
