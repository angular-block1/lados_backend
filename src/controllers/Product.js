import Product from "../models/Product.js";
import Category from "../models/Category.js";
import productShema from "../validations/product.js";

export const get = async (req, res) => {
  try {
    const { slug } = req.params
    if (slug) {
      const product = await Product.findOne({slug}).populate({
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
    const { _sort = "createdAt", _limit = 10, _page = 1, _order = "desc", _category="" } = req.query
    if (_category !== "") {
      const data = await Product.find({ category: _category })
      if (data.length == 0) {
        return res.status(404).json({
          message:"Không tìm thấy sản phẩm nào!"
        })
      }
      return res.json({data})
    }
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
      return res.status(204).json({ message: "Không tìm thấy sản phẩm!" })
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
