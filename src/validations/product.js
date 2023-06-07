import joi from "joi";

const productShema = joi.object({
  name: joi.string().required(),
  slug: joi.string().required(),
  price: joi.number().required(),
  stock: joi.number().required(),
  images: joi.array().required(),
  category: joi.string().required(),
  description: joi.string().required(),
});


export default productShema;
