import Product from "../models/Product.js";
import Category from "../models/Category.js";
import productShema from "../validations/product.js";

export const get = async (req, res) => {
  try {
    const { id } = req.params;

    if (id) {
      const product = await Product.findById(id).populate({
        path: "category",
      });

      return res.json({
        message: "Chi tiết sản phẩm",
        data: product,
      });
    } else {
      const products = await Product.find(id).populate({
        path: "category",
      });

      return res.json({
        message: "Danh sách sản phẩm",
        data: products,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const create = async (req, res) => {
  try {
    const { error } = productShema.validate(req.body);
    if (error) {
      const errors = error.details.map((items) => items.message);
      return res.status(401).json({
        message: errors,
      });
    }
    const newProduct = await Product.create(req.body);
    if (!newProduct) {
      return res.status(400).json({
        message: "Thêm sản phẩm thất bại",
      });
    }

    await Category.findByIdAndUpdate(newProduct.category, {
      $addToSet: {
        products: newProduct._id,
      },
    });

    return res.status(201).json({
      message: "Thêm sản phẩm thành công",
      newProduct,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const update = async (req, res) => {
  try {
  } catch (error) {}
};

export const remove = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findByIdAndDelete(id);
    await Category.findByIdAndUpdate(product.category, {
      $pull: {
        products: product._id,
      },
    });
    return res.status(200).json({
      message: "Xóa sản phẩm thành công",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const products = await Product.find().populate({
      path: "category",
    });
    return res.status(200).json({
      message: "Thành công",
      products,
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};
