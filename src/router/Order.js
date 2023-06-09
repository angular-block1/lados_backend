import express from "express";
<<<<<<< HEAD
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
=======
import {
  get,
  create,
  cancelOrder,
  getOrderByUser,
  payMomo,
  payVnPay,
  updateOrder,
  updateOrderStatus,
  getMonth,
} from "../controllers/Order.js";
import { verifyAccessToken } from "../middlewares/middlewareAuth.js";

const router = express.Router();
router.use(verifyAccessToken);
router.get("/ds", getMonth);
router.get("/me", getOrderByUser);
router.post("/", create);
router.get("/:id", get);
router.get("/", get);
router.post("/pay-momo", payMomo);
router.post("/pay-vnpay", payVnPay);
router.put("/:id", updateOrder);
router.delete("/:id", cancelOrder);
router.patch("/:id", updateOrderStatus);

export default router;
>>>>>>> e32c446735400e4f5e7abb4ef4b3ce89b601f6e9
