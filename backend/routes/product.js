const router = require('express').Router();
const multer = require('multer');
const fs = require('fs');
let Product = require('../models/product.model');

const storage = multer.diskStorage({
    destination: function (req, res, cb) {
        cb(null, './uploads/')
    }
});

const upload = multer({storage: storage});

router.route('/').get((req, res) => {
	Product.find()
	.populate('vendor_id')
	.then(users => res.json(users))
	.catch(err => res.status(400).json(err));
});

router.route('/:id').get((req, res) => {
	Product.findById(req.params.id)
	.populate('vendor_id')
	.then(user => res.json(user))
	.catch(err => res.status(400).json(err))
})

router.route('/update/:id').post((req, res) => {
	Product.findById(req.params.id)
	.then(prod => {
		prod.status = req.body.status;
		if(prod.status === "cancelled") {
			prod.max_quantity = 0;
			prod.ordered = 0;
		}
		prod.save()
		.then(() => res.json("Changed Successfully!"))
		.catch(err => res.status(400).json('Error: ' + err));
	})
	.catch(err => res.status(400).json('Error: ' + err));
});

router.route('/search/:keyword').get((req, res) => {
	
	let keyword = req.params.keyword;
	if(keyword === 'showall') keyword = '';
	Product.find( {
		'name': { "$regex": ".*" + keyword + ".*", "$options": "i" },
	    'status': 'listed'
	})
	.populate('vendor_id')
	.then(prods => res.json(prods))
	.catch(err => res.status(400).json('Error: '+ err));

});
router.route('/add').post(upload.single('file'), (req, res) => {
	let img = ''
	if(req.file) {
		img = {
			data: fs.readFileSync(req.file.path),
			contentType: 'image/jpeg'
		}
	}
	const newProduct = {
		name: req.body.name,
		price: req.body.price,
		max_quantity: req.body.quantity,
		picture: img,
		status: req.body.status,
		vendor_id: req.body.id,
		ordered: 0
	}

	const prod = new Product(newProduct)
	
	prod.save()
	.then(() => res.json("Product Added!"))
	.catch(err => res.status(400).json('Error: ' + err));

});

router.route('/:seller/:status').get((req, res) => {
	let status = req.params.status
	let vendor = req.params.seller
	Product.find({status: status, vendor_id: vendor})
	.then(prods => res.json(prods))
	.catch(err => res.status(400).json(err));
});

module.exports = router;