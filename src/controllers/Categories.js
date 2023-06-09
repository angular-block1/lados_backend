import Category from "../models/Category.js";
import categorySchema from "../validations/category.js";
import Product from "../models/Product.js";



export const add = async (req, res) => {
  try {
    const { error } = categorySchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((items) => items.message);
      return res.status(401).json({
        message: errors,
      });
    }
    const newCategory = await Category.create(req.body);
    if (!newCategory) {
      return res.status(400).json({
        message: "Thêm sản phẩm thất bại",
      });
    }
    return res.status(200).json({
      message: "Thành công",
      data: newCategory,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const remove = async (req, res) => {
  try {
    const id = req.params.id;
    const newCategory = await Category.findByIdAndDelete(id);
    newCategory.products.forEach(async (item) => {
      await Product.findByIdAndUpdate(item, {
        category: "123213123213",
      });
    });
    return res.status(200).json({
      message: "Thành công",
      newCategory,
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};
