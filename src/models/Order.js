import { Schema, model } from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2";

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
		type: Array,
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

orderSchema.plugin(mongoosePaginate);

export default model('Order', orderSchema)