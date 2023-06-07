import { Schema, model } from "mongoose"


const orderSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	shipping: {
		type: Object,
	},
	bill: {
		type: Number,
	},
	payment: {
		type: Object
	},
	products: {
		type: [{ type: Schema.Types.ObjectId, ref: "Product" }],
		default: []
	},
	status: {
		type: String,
		default: "processing",
		emun: ['processing', "confirmed", "delivering", "cancelled", "delivered"]
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
})

export default model('Order', orderSchema)