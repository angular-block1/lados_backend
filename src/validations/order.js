import joi from "joi"

const orderSchema = joi.object({
	bill: joi.number().required(),
	shipping: joi.object().required(),
	payment: joi.object().default({}).required(),
	products: joi.array().default([]),
	status: joi.string().default('processing')
})

export default orderSchema