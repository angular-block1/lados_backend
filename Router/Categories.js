import express from "express";
import { add } from "../Controllers/Categories.js";

const router = express.Router();

router.post("/", add);

export default router;