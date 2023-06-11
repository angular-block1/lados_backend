import User from "../models/User.js";
import useSchema from "../validations/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import loginSchema from "../validations/login.js";
export const signup = async (req, res) => {
  try {
    const { name, email, password, confirmpassWord } = req.body;
    const { error } = useSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((items) => items.message);
      return res.status(400).json({
        message: errors,
      });
    }
    const userExit = await User.findOne({ email: email });
    if (userExit) {
      return res.status(400).json({
        message: "Email này đã tồn tại",
      });
    }
    const handlepassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name: name,
      email: email,
      password: handlepassword,
    });

    return res.status(201).json({
      message: "Đăng kí thành công",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { error } = loginSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((item) => item.message);
      return res.status(400).json({
        message: errors,
      });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        message: "Email không tồn tại",
      });
    }
    const isMathpassword = await bcrypt.compare(password, user.password);
    if (!isMathpassword) {
      return res.status(400).json({
        message: "Mật khẩu không chính xác",
      });
    }
    const accessToken = await jwt.sign({ _id: user._id }, "oke", {
      expiresIn: "1d",
    });
    const data = {
      email: user.email,
      name: user.name,
      role: user.role
    };
    return res.status(201).json({
      message: "Đăng nhập thành công",
      accessToken,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
