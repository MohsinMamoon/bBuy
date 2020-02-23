const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let Product = new Schema({
	name: {
		type: String,
		required: true,
		trim: true
	},
	price: {
		type: Number,
		required: true
	},
	max_quantity: {
		type: Number,
		required: true
	},
	ordered: {
		type: Number,
	},
	picture: { 
		data: Buffer, 
		contentType: String
	},
	status: {
		type: String
	},
	vendor_id: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	}
}, {
	timestamps: true
});

module.exports = mongoose.model('Product', Product);