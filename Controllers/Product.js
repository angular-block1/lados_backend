import Product from "../Model/Product.js";
import Categories from "../Model/Category.js";

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
  } catch (error) {}
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
