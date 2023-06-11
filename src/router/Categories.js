import express from "express";
import {
  add,
  cateUpdate,
  getAll,
  getOne,
  remove,
} from "../controllers/Categories.js";

const router = express.Router();

router.post("/", add);
router.delete("/:id", remove);
router.get("/", getAll);
router.get("/:slug", getOne);
router.put("/:id", cateUpdate);

export default router;
