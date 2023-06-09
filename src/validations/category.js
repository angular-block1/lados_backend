import joi from "joi";

const categorySchema = joi.object({
  name: joi.string().required(),
  slug: joi.string().required(),
  products: joi.array(),
});

export default categorySchema;
