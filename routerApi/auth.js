const { Router } = require("express");
const passport = require("passport");
const User = require("../model/user");

const router = Router();

router.post("/login", (req, res) => {
	const { username, password } = req.body;
	const newUser = new User({ username, password });
	newUser.save();
	res.status(200).send("Bien hecho");
	console.log(req.body);
});

module.exports = router;
