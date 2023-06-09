import Order from "../models/Order.js";
import Product from "../models/Product.js";
import orderSchema from "../validations/order.js";
import axios from "axios";
import crypto from "crypto";
import querystring from "query-string";
import sortObject from "sortobject";
import dateFormat from "dateformat";
import moment from "moment/moment.js";

export async function get(req, res) {
  try {
    const { id } = req.params;
    const {
      _page = 1,
      _sort = "createdAt",
      _order = "asc",
      _limit = 10,
    } = req.query;

    const options = {
      page: _page,
      limit: _limit,
      sort: {
        [_sort]: _order == "desc" ? -1 : 1,
      },
      populate: "user",
    };

    if (id) {
      const order = await Order.findById(id);

      if (!order) {
        return res.status(404).json({
          message: "Không tìm thấy đơn hàng",
        });
      }

      return res.json({
        message: "successfully",
        data: order,
      });
    } else {
      const {
        docs,
        totalPages,
        totalDocs,
        limit,
        hasPrevPage,
        pagingCounter,
        hasNextPage,
        page,
        nextPage,
        prevPage,
      } = await Order.paginate({}, options);

      return res.json({
        message: "successfully",
        data: docs,
        paginate: {
          limit,
          totalDocs,
          totalPages,
          page,
          pagingCounter,
          hasPrevPage,
          hasNextPage,
          prevPage,
          nextPage,
        },
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

export async function create(req, res) {
  try {
    const { error } = orderSchema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = {};
      error.details.forEach((e) => (errors[e.path] = e.message));
      return res.status(401).json({
        message: errors,
      });
    }

    const { _id } = req.user;
    const { payment, shipping } = req.body;

    let products = await Promise.all(
      req.body.products.map(async ({ _id, quantity }) => {
        const product = await Product.findById(_id);
        product.stock -= quantity;
        product.save();

        return {
          _id: product._id,
          name: product.name,
          price: product.price,
          images: product.images,
          quantity,
        };
      })
    );

    let bill = products.reduce((acc, product) => {
      return (acc += product.price * product.quantity);
    }, 0);

    const order = await Order.create({
      user: _id,
      payment,
      shipping,
      products,
      bill,
    });

    return res.status(201).json({
      message: "Tạo đơn hàng thành công",
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

export async function getOrderByUser(req, res) {
  try {
    const { _id } = req.user;
    const orders = await Order.find({
      user: _id,
    });

    return res.json({
      message: "Danh sách đơn hàng đã mua",
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

export async function cancelOrder(req, res) {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        message: "Không tìm thấy đơn hàng",
      });
    }

    const products = order.products;

    for (let item of products) {
      const product = await Product.findById(item._id);
      product.stock += product?.quantity;
      await product.save();
    }

    order.status = "cancelled";
    order.createdAt = new Date().toISOString();
    await order.save();

    return res.json({
      message: "Hủy đơn hàng thành công",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

export async function updateOrderStatus(req, res) {
  try {
    const { status } = req.body;
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        message: "Đơn hàng không tồn tại",
      });
    }

    if (status === "cancelled") {
      for (let item of order.products) {
        const product = await Product.findById(item._id);
        product.stock += product?.quantity;
        await product.save();
      }
    }

    order.status = status;
    await order.save();

    return res.json({
      message: "Cập nhật đơn hàng thành công",
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

export async function updateOrder(req, res) {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        message: "Đơn hàng không tồn tại",
      });
    }

    const orderUpdate = await Order.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: {
          payment: {
            methods: order?.payment?.methods,
            status: true,
            ...req.body,
          },
        },
      },
      { new: true }
    );

    return res.json({
      message: "Cập nhật đơn hàng thành công",
      data: orderUpdate,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

export async function payMomo(req, res) {
  try {
    const { bill, order: _id } = req.body;
    var partnerCode = "MOMO";
    var accessKey = "F8BBA842ECF85";
    var secretkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
    var requestId = partnerCode + new Date().getTime();
    var orderId = requestId;
    var orderInfo = "Thanh Toán MoMo";
    var redirectUrl = "http://localhost:4200" + `/thanks?_id=${_id}`;
    var ipnUrl = "https://callback.url/notify";
    var amount = bill;
    var requestType = "payWithATM";
    var extraData = ""; //pass empty value if your merchant does not have stores
    var rawSignature =
      "accessKey=" +
      accessKey +
      "&amount=" +
      amount +
      "&extraData=" +
      extraData +
      "&ipnUrl=" +
      ipnUrl +
      "&orderId=" +
      orderId +
      "&orderInfo=" +
      orderInfo +
      "&partnerCode=" +
      partnerCode +
      "&redirectUrl=" +
      redirectUrl +
      "&requestId=" +
      requestId +
      "&requestType=" +
      requestType;
    var signature = crypto
      .createHmac("sha256", secretkey)
      .update(rawSignature)
      .digest("hex");
    const requestBody = {
      partnerCode: partnerCode,
      accessKey: accessKey,
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: redirectUrl,
      ipnUrl: ipnUrl,
      extraData: extraData,
      requestType: requestType,
      signature: signature,
      lang: "en",
    };
    const response = await axios.post(
      "https://test-payment.momo.vn/v2/gateway/api/create",
      requestBody,
      {
        headers: {
          port: 443,
        },
        withCredentials: true,
      }
    );

    return res.status(201).json({
      message: "successfully",
      data: {
        url: response?.data?.payUrl,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}


export async function payVnPay(req, res) {
  try {
    const { bill, order: _id } = req.body;
    var ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;
    var tmnCode = "ASEISEUK";
    var secretKey = "JPLMHIHUZVKMLEEJBYATSSMPAYJQQWWP";
    var vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    var returnUrl =
      "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html" +
      `/thanks?_id=${_id}`;
    var date = new Date();
    var createDate = dateFormat(date, "yyyymmddHHmmss");
    var orderId = dateFormat(date, "HHmmss");
    var amount = bill;
    var bankCode = "NCB";

    var orderInfo = "Nội dung thanh toán";
    var orderType = "billpayment";
    var locale = "vn";
    if (locale === null || locale === "") {
      locale = "vn";
    }
    var currCode = "VND";
    var vnp_Params = {};
    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = tmnCode;
    // vnp_Params['vnp_Merchant'] = ''
    vnp_Params["vnp_Locale"] = locale;
    vnp_Params["vnp_CurrCode"] = currCode;
    vnp_Params["vnp_TxnRef"] = orderId;
    vnp_Params["vnp_OrderInfo"] = orderInfo;
    vnp_Params["vnp_OrderType"] = orderType;
    vnp_Params["vnp_Amount"] = amount * 100;
    vnp_Params["vnp_ReturnUrl"] = returnUrl;
    vnp_Params["vnp_IpAddr"] = ipAddr;
    vnp_Params["vnp_CreateDate"] = createDate;
    if (bankCode !== null && bankCode !== "") {
      vnp_Params["vnp_BankCode"] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    var signData = querystring.stringify(vnp_Params, { encode: false });
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
    vnp_Params["vnp_SecureHash"] = signed;
    vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

    return res.status(201).json({
      message: "successfully",
      data: {
        url: vnpUrl,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}
export const getMonth = async (req, res) => {
  try {
    const arr = [];
    for (let i = 1; i < 13; i++) {
      const startOfMonth = moment(`2023-${i}-01`, "YYYY-MM-DD").startOf(
        "month"
      );
      const endOfMonth = moment(`2023-${i}-01`, "YYYY-MM-DD").endOf("month");
      const orders = await Order.find({
        createdAt: {
          $gte: startOfMonth,
          $lt: endOfMonth,
        },
      });
      const totalAmount = await orders.reduce((acc, item) => {
        return (acc += item.bill);
      }, 0);
      arr.push(totalAmount);
    }
    console.log(arr);
    return res.status(200).json({
      message: "Thành công",
      arr,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
