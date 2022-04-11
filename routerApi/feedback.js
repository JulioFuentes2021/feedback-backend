const express = require("express");
const router = express.Router();
const Feedback = require("../model/message");
const passport = require("passport");
const boom = require("@hapi/boom");
const { createFeedbackValidation } = require("../schemas/feedback.schema");
const validatorHandler = require("../middleware/validator.handler");
const config = require('../config/config');
const jwt = require('jsonwebtoken');
const addUpvotes = require('../views/Feeedback');

router.get("/", (req, res) => {
	res.send("Express.js is amazing :)");
});

router.get("/all", async (req, res) => {
	const data = await Feedback.find({});
	res.json(data);
});




const authenticate = (req, res, next) => {
	const authHeader = req.headers['authorization']
	const token = authHeader && authHeader.split(';')[0].split(' ')[1].split('=')[1]
	if (token == null) return res.sendStatus(401)
	console.log('Este es el token', token);
	// console.log('Este es el header: ', authHeader);
	console.log('COookies desde el signIN ppapa: ', req.cookies)

	try {
		const data = jwt.verify(token, config.jwtSecret)
		const name = data.name
		res.cookie("name", name);
		console.log('Este es el data.sub: ', data.sub)
		console.log('El token esta bueno')
	} catch (err) {
		console.log('El token esta malo')
		next(boom.unauthorized('You have to sign in.'))
	}

	next()
}

//! El usuario que finalmente se le asigno ese token desde el cliente debe ahora continuamente enviar estos tokens en los header para que se mantenga la sesion.
router.post(
	"/add",
	authenticate,
	validatorHandler(createFeedbackValidation, "body"),
	async (req, res, next) => {
		try {
			const { title, feature, description } = req.body;
			console.log(req.body)
			const newFeedback = new Feedback({
				title: title,
				feature: feature,
				description: description,
				// test: test
			});
			//Guarda la base de datos
			await newFeedback.save();
			// await newFeedback.deleteMany();
			res.json({
				messsage: "Exitos",
			});
		} catch (error) {
			next(boom.badRequest("Title, feature and description are required."));
		}
	}
);

router.delete('/delete', async (req, res) => {
	await Feedback.deleteMany()
	res.send('ELiminados')
})




const getPayload = (req, res, next) => {
	const jwtToken = req.headers['authorization'].split(' ')[1];
	const payload = jwt.verify(jwtToken, config.jwtSecret);
	req.body.payload = payload;
	next()
}

const test = (req, res, next) => {
	console.log('Middleware: ', req.body)
	req.body.name = 'Julioooo'
	next()
}

//Create the upvote by patch,put and understang how can I implement it in mongoose.
router.patch('/addUpvote', passport.authenticate('jwt'), getPayload, test, (req, res) => {
	const { test } = req.body
	console.log('Final body', req.body)
	console.log(req.headers['authorization'])
	addUpvotes(req.body.id, req.body.payload.sub)
	res.send('Aquii andamos')
})

module.exports = router;
