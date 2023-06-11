import Category from "../models/Category.js";
import categorySchema from "../validations/category.js";


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
    const productUpdate = await Product.find({ category: id });
    for (const product of productUpdate) {
      await Product.findOneAndUpdate(
        { _id: product._id },
        { cateId: "6482d6ccc6a7d73bcdd551a4" },
        { new: true }
      );
    }
    await Category.findOneAndUpdate(
      { _id: "6482d6ccc6a7d73bcdd551a4" },
      {
        products: [...productUpdate],
      }
    );

    const cate = await Category.findOneAndRemove({ _id: id });
    if (!cate) {
      return res.status(401).json({
        message: "Xóa thất bại",
      });
    }
    return res.status(200).json({
      message: "Thành công",
      cate,
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};
export const getOne = async (req, res) => {
  try {
    const { slug } = req.params;
    const cate = await Category.find({ slug });
    if (!cate) {
      return res.status(404).json({
        message: "không tìm thấy ",
      });
    }
    return res.json({
      message: "Chi tiết",
      data: cate,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const getAll = async (req, res) => {
  try {
    const cates = await Category.find();
    if (!cates) {
      return res.status(404).json({
        message: "không tìm thấy danh mục",
      });
    }
    return res.json({
      data: cates,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const cateUpdate = async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;
    const { error } = categorySchema.validate(body);
    if (error) {
      const errors = error.details.map((items) => items.message);
      return res.status(401).json({
        message: errors,
      });
    }
    const cate = await Category.findOne({ _id: id });
    const newcate = {
      name: body.name,
      slug: body.slug,
      products: cate.products,
    };
    const cateupdated = await Category.findOneAndUpdate({ _id: id }, newcate, {
      new: true,
    });
    if (!cateupdated) {
      return res.status(401).json({
        message: "Cập nhật thất bại",
      });
    }
    return res.status(200).json({
      message: "Thành công",
      cateupdated,
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};
