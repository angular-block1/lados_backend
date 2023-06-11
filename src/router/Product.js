import express from "express";
import {
  get,
  create,
  remove,
  update,
  filterPrice,
} from "../controllers/Product.js";

const router = express.Router();

router.get("/", get);
router.get("/price", filterPrice);
router.get("/:slug", get);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", remove);

export default router;
