const router = require('express').Router();
let User = require('../models/user.model');
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.route('/').get((req, res) => {
	User.find()
	.then(users => res.json(users))
	.catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
	User.findById(req.params.id)
	.then(user => res.json(user))
	.catch(err => res.status(400).json('Error: ' + err))
});

router.route('/authenticate').post((req, res) => {
	const username = req.body.username;
	const password = req.body.password;
	const role = req.body.role;

	User.findOne({'username': username, 'role': role})
	.then(user => {
		if (user) {
			bcrypt.compare(password, user.password)
			.then(result => {
				if(result) {
					bcrypt.hash(password+role+user, saltRounds)
					.then(result => res.json({ user: user, accessToken: result}))
					.catch(err => res.status(400).json('Error: ' + err));
				}
				else {
					res.json({user: null, token: ''});
				}
			})
			.catch(err => res.status(400).json('Error: ' + err));
		}
		else {
			res.json({user: null, token: ''});
		} 
	})
	.catch(err => res.status(400).json('Error: ' + err))
});

router.route('/register').post((req, res) => {
	
	const newuser = {
		username: req.body.username,
		password: '',
		role: req.body.role,
		avg_rating: 0,
		ratings: 0
	}
	const pass = req.body.password;

	bcrypt.hash(pass, saltRounds)
	.then(result => {
		newuser.password = result
		let user = new User(newuser)
		user.save()
		.then(() => res.json("Success!"))
		.catch(err => res.status(400).json('Error: ' + err));
	})
	.catch(err => console.log(err));

});

module.exports = router;