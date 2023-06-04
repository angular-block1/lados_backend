import Product from "../Model/Product.js";

export const getAll = async (req, res) => {
  try {
  } catch (error) {}
};

export const getOne = async (req, res) => {
  try {
  } catch (error) {}
};

export const Add = async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    return res.status(200).json({
      message: "Thêm sản phẩm thành công",
      newProduct,
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};

export const Update = async (req, res) => {
  try {
  } catch (error) {}
};

export const Remove = async (req, res) => {
  try {
  } catch (error) {}
};
