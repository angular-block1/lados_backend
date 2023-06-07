import Category from "../models/Category.js";
import categorySchema from "../validations/category.js";


export const add = async (req, res) => {
  try {
    const { error } = categorySchema.validate(req.body);
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
