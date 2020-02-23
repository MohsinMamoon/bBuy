const router = require('express').Router();
let Order = require('../models/order.model');
let Product = require('../models/product.model');


router.route('/').get((req, res) => {
	Order.find()
	.populate('User', 'Product')
	.then(orders => res.json(orders))
	.catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
	
	let order = {
		product_id: req.body.product,
		customer_id: req.body.customer,
		quantity: req.body.quantity
	}
	
	let newOrder = new Order(order)

	// res.json(newOrder);
	newOrder.save()
	.then(() => {
		Product.findById(newOrder.product_id)
		.then(prod => {
			prod.ordered += order.quantity
			if(prod.ordered === prod.max_quantity) {
				prod.status = "ready";
			}
			else {
				prod.status = "listed";
			}
			prod.save()
			.catch(err => console.log('Error while saving ordered of Product: ' + err ));
		})
		.catch(err => console.log('Error while updating ordered of Product: ' + err ));
	})
	.then(() => res.json("Successfully Created!"))
	.catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
	Order.find({customer_id: req.params.id})
	.populate('product_id')
	.then(orders => res.json(orders))
	.catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
	Order.findById(req.params.id)
	.then(order => {
		Product.findById(order.product_id)
		.then(prod => {
			prod.ordered -= order.quantity
			prod.save()
			.catch(err => console.log('Error while saving ordered of Product: ' + err ));
		})
		.catch(err => console.log('Error while updating ordered of Product: ' + err ))
	})
	.then(() => {
		Order.findByIdAndDelete(req.params.id)
		.then(() => res.json("Successfully Created!"))
		.catch(err => res.status(400).json('Error: ' + err))
	})
	.catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').post((req, res) => {
	Order.findById(req.params.id)
	.then(order => {
		Product.findById(order.product_id)
		.populate('product_id')
		.then(prod => {
			prod.ordered -= order.quantity
			prod.ordered += req.body.quantity
			if(prod.ordered === prod.max_quantity) {
				prod.status = "ready";
			}
			else {
				prod.status = "listed";
			}
			prod.save()
			.catch(err => console.log('Error while saving ordered of Product: ' + err ));
		})
		.then(() => {
			order.quantity = req.body.quantity
			order.save()
			.then(() => res.json("Updated Order Succesfully!"))
			.catch(err => res.status(400).json('Error: ' + err));
		})
		.catch(err => console.log('Error while updating ordered of Product: ' + err ))
	})
	.catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;