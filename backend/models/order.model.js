const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let Order = new Schema({
	product_id: {
		type: Schema.Types.ObjectId,
		ref: 'Product',
		required: true
	},
	customer_id: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	quantity: {
		type: Number,
		required: true
	}
}, {
	timestamps: true
});

module.exports = mongoose.model('Order', Order);