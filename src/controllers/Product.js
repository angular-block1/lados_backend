import Product from "../models/Product.js";
import Category from "../models/Category.js";
import productShema from "../validations/product.js";

export const get = async (req, res) => {
  try {
    const { id } = req.params
    if (id) {
      const product = await Product.findById(id).populate({
        path: "category"
      })
      if (!product) {
        return res.status(404).json({
          message: "không tìm thấy sản phẩm"
        })
      }
      return res.json({
        message: "Chi tiết sản phẩm",
        data: product
      })

    }
    const { _sort = "createdAt", _limit = 10, _page = 1, _order = "desc" } = req.query
    const options = {
      sort: _sort,
      limit: _limit,
      page: _page,
      sort: {
        [_sort]: _order === "desc" ? -1 : 1
      }
    }
    const { docs: data, totalPages, totalDocs } = await Product.paginate({}, options)
    if (data.length === 0) {
<<<<<<< HEAD
      return res.status(404).json({ message: "None of products are found!" })
=======
      return res.status(204).json({ message: "None of products are found!" })
>>>>>>> e32c446735400e4f5e7abb4ef4b3ce89b601f6e9
    }
    return res.json({
      message: "Danh sách sản phẩm",
      data,
      totalDocs,
      totalPages
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

export const create = async (req, res) => {
  try {
    const { error } = productShema.validate(req.body, { abortEarly: false });
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
      data: newProduct,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params
    const foundProduct = await Product.findById(id)
    if (!foundProduct) {
      return res.status(404).json({ message: "không tìm thấy sản phẩm!" })
    }
    const { error } = productShema.validate(req.body)
    if (error) {
      return res.status(400).json({ message: error.details[0].message })
    }
    const data = await Product.findByIdAndUpdate(id, req.body, { new: true })
    if (req.body.category != foundProduct.category) {
      await Category.findByIdAndUpdate(foundProduct.category, {
        $pull: {
          products: req.body._id
        }
      })
      await Category.findByIdAndUpdate(req.body.category, {
        $addToSet: {
          products: req.body._id
        }
      })

      return res.status(200).json({
        message: "Cập nhật thành công!",
        data
      })
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    })
  }
};

export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({
        message: "không tìm thấy sản phẩm"
      })
    }
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
      message: error.message,
    });
  }
};
