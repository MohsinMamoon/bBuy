const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let User = new Schema({
	username: {
		type: String,
		required: true,
		unique: true,
		trim: true,
	},
	password: {
		type: String,
		required: true
	},
	role: {
		type: String,
		required: true
	},
	avg_rating: {
		type: Number
	}, 
	ratings: {
		type: Number
	}
}, {
	timestamps: true
});

module.exports = mongoose.model('User', User);