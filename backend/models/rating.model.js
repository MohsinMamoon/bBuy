const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let Rating = new Schema({
	rating: {
		type: Number,
		required: true
	},
	review: {
		type: String
	}, 
	customer_id: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'User'
	},
	vendor_id: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'User'
	},
	product_id: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'Product'
	}
}, {
	timestamps: true
});

module.exports = mongoose.model('Rating', Rating);