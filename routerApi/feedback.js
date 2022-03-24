const express = require("express");
const router = express.Router();
const Feedback = require("../model/message");
const passport = require("passport");
const boom = require('@hapi/boom')

router.get("/", (req, res) => {
	res.send("Express.js is amazing :)");
});

router.get("/all", async (req, res) => {
	const data = await Feedback.find({});
	// console.log(data._id);
	res.json(data);
});


//! El usuario que finalmente se le asigno ese token desde el cliente debe ahora continuamente enviar estos tokens en los header para que se mantenga la sesion.
router.post("/add", passport.authenticate('jwt', { session: false }), async (req, res, next) => {
	try {
		const { title, feature, description } = req.body;
		//res.end();
		// res.status(200).json({ message: "Correcto..." });
		const newFeedback = new Feedback({
			title: title,
			feature: feature,
			description: description,
		});
		//Guarda la base de datos
		await newFeedback.save();
		console.log(req.body);
		res.json({
			messsage: "Exitos"
		})
	} catch (error) {
		next(boom.badRequest('Title, feature and description are required.'))
	}
});

module.exports = router;
