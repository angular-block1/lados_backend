import joi from "joi";
const cateproductShema = joi.object({
  name: joi.string().required().messages({
    "String.any": "Bắt buộc",
  }),
  image:joi.string().required().messages({
    "String.any": "Bắt buộc"
  })
});
export default cateproductShema;
