import Jwt from "jsonwebtoken";
import User from "../models/User.js";

export function verifyAccessToken(req, res, next) {
  const accessToken = req.headers?.authorization?.split(" ")[1];

  if (!accessToken) {
    return res.status(401).json({
      message: "Bạn chưa đăng nhập",
    });
  }

  Jwt.verify(accessToken, "oke", (err, payload) => {
    if (err) {
      return res.status(401).json({
        message: err.message
      });
    }

    req.user = payload;
    next();
  });
}

const checkAuth = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({
        message: "Bạn chưa đăng nhập",
      });
    }
    const token = req.headers.authorization.split(" ")[1];
    const { _id } = await Jwt.verify(token, "oke");
    const user = await User.findOne({ _id: _id });
    if (!user) {
      return res.status(400).json({
        message: "Không tìm thấy",
      });
    }
    if (user.role != "admin") {
      return res.status(401).json({
        message: "Bạn không có quyền",
      });
    }
    req.user = { _id };
    next();
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export default checkAuth;


