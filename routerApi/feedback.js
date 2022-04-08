const express = require("express");
const router = express.Router();
const Feedback = require("../model/message");
const passport = require("passport");
const boom = require("@hapi/boom");
const { createFeedbackValidation } = require("../schemas/feedback.schema");
const validatorHandler = require("../middleware/validator.handler");
const config = require('../config/config');
const jwt = require('jsonwebtoken');


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
				test: [{ name: 'Julio opao' }]
			});
			//Guarda la base de datos
			await newFeedback.save();
			res.json({
				messsage: "Exitos",
			});
		} catch (error) {
			next(boom.badRequest("Title, feature and description are required."));
		}
	}
);

module.exports = router;
