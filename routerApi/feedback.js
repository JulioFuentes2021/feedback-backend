const express = require("express");
const router = express.Router();
const Feedback = require("../model/message");

router.get("/", (req, res) => {
	res.send("Express.js is amazing :)");
});

router.get("/all", async (req, res) => {
	const data = await Feedback.find({});
	// console.log(data._id);
	res.json(data);
});

router.post("/add", (req, res) => {
	const { title, feature, description } = req.body;
	res.end();
	// res.status(200).json({ message: "Correcto..." });
	const newFeedback = new Feedback({
		title: title,
		feature: feature,
		description: description,
	});
	//Guarda la base de datos
	newFeedback.save();
	console.log(req.body);
});

module.exports = router;
