import joi from "joi";

const categorySchema = joi.object({
  createdAt: joi.string(),
  updatedAt: joi.string(),
  __v: joi.number(),
  name: joi.string().required(),
  slug: joi.string().required(),
  products: joi.array(),
});

export const categorySchemaupdate = joi.object({
  _id: joi.string(),
  createdAt: joi.string(),
  updatedAt: joi.string(),
  __v: joi.number(),
  name: joi.string().required(),
  slug: joi.string().required(),
  products: joi.array(),
});

export default categorySchema;
