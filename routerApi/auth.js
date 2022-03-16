const { Router } = require("express");
const passport = require("passport");
const User = require("../model/user");
const bcrypt = require("bcrypt")
const { users } = require("../views/user")

const router = Router();

router.post("/login", async (req, res) => {
	const { username, password } = req.body;
	const hash = await bcrypt.hash(password, 10)
	const newUser = new User({ username, password: hash });
	newUser.save();
	delete password
	res.status(200).send("Bien hecho");
});

router.get("/users", async (req, res) => {
	const Users = await users()
	res.json(Users)
})

module.exports = router;
