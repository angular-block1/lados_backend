import Product from "../Model/Product.js";
import Categories from "../Model/Category.js";
import productShema from "../validate/product.js";

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
    await Categories.findByIdAndUpdate(newProduct.categoryId, {
      $addToSet: {
        products: newProduct._id,
      },
    });
    return res.status(200).json({
      message: "Thêm sản phẩm thành công",
      newProduct,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const Update = async (req, res) => {
  try {
  } catch (error) {}
};

export const Remove = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findByIdAndDelete(id);
    await Categories.findByIdAndUpdate(product.categoryId, {
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
