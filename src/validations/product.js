import joi from "joi";

const productShema = joi.object({
  name: joi.string().min(6).required(),
  slug: joi.string().required(),
  price: joi.number().min(0).required(),
  stock: joi.number().min(0).required(),
  images: joi.array().required(),
  category: joi.string().required(),
  description: joi.string().required(),
  status: joi.boolean()
});


export default productShema;
