import express from "express";
import { getAll, getOne, Add, Remove, Update } from "../Controllers/Product.js";

const router = express.Router();

router.post("/", Add);
router.get("/", getAll);
router.put("/:id", Update);
router.get("/:id", getOne);
router.delete("/:id", Remove);

export default router;
