import Categories from "../Model/Category.js";
import cateproductShema from "../validate/cate.js";


export const add = async (req, res) => {
  try {
    const { error } = cateproductShema.validate(req.body);
    if (error) {
      const errors = error.details.map((items) => items.message);
      return res.status(401).json({
        message: errors,
      });
    }
    const newCategory = await Categories.create(req.body);
    if (!newCategory) {
      return res.status(400).json({
        message: "Thêm sản phẩm thất bại",
      });
    }
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
