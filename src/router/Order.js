import express from "express";
import { get, create, cancelOrder, getOrderByUser, payMomo, payVnPay, updateOrder, updateOrderStatus } from "../controllers/Order.js"
import { verifyAccessToken } from "../middlewares/middlewareAuth.js"

const router = express.Router()

router.use(verifyAccessToken)
router.get("/me", getOrderByUser)
router.post('/', create)
router.get("/:id", get)
router.get("/", get)
router.post("/pay-momo", payMomo)
router.post("/pay-vnpay", payVnPay)
router.put("/:id", updateOrder)
router.delete("/:id", cancelOrder)
router.patch("/:id", updateOrderStatus)

export default router