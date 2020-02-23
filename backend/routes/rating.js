const router = require('express').Router();
let Rating = require('../models/rating.model');
let User = require('../models/user.model');

router.route('/').get((req, res) => {
	Rating.find()
	.then(users => res.json(users))
	.catch(err => res.status(400).json(err));
});

router.route('/product/:id').get((req, res) => {
	Rating.find({product_id: req.params.id})
	.populate('customer_id')
	.then(ratings => res.json(ratings))
	.catch(err => res.status(400).json('Error: ' + err));
});

router.route('/account/:id').get((req, res) => {
	console.log("Here")
	Rating.find({vendor_id: req.params.id})
	.populate('customer_id')
	.populate('product_id')
	.then(ratings => res.json(ratings))
	.catch(err => res.status(400).json('Error: ' + err));
});
router.route('/add').post((req, res) => {
	let rating = {
		rating: req.body.rating,
		review: req.body.review,
		vendor_id: req.body.vendor,
		customer_id: req.body.customer,
		product_id: req.body.product
	}

	let newRating = new Rating(rating)

	newRating.save()
	.then(() => {
		User.findById(rating.vendor_id)
		.then(vendor => {
			vendor.avg_rating = ((vendor.avg_rating * vendor.ratings) + rating.rating) / (vendor.ratings + 1);
			vendor.ratings += 1
			vendor.save()
			.then(() => res.json("Rating Uploaded Succesfully!"))
			.catch(err => console.log("Error while saving rating for vendor: " + err))
		})
		.catch(err => console.log("Error while updating rating for vendor: " + err))
	})
	.catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;