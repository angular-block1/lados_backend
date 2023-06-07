import express from "express";
import { add } from "../controllers/Categories.js";

const router = express.Router();

router.post("/", add);

export default router;