const { Router } = require("express");
const passport = require("passport");
const User = require("../model/user");
const bcrypt = require("bcrypt");
const { users } = require("../views/user");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const boom = require("@hapi/boom");
const { loginAndSignInValidator } = require("../schemas/feedback.schema");
const validatorHandler = require("../middleware/validator.handler");

const router = Router();

router.post(
	"/login",
	validatorHandler(loginAndSignInValidator, "body"),
	async (req, res, next) => {
		try {
			const { username, password } = req.body;
			const hash = await bcrypt.hash(password, 10);
			const newUser = new User({ username, password: hash });
			await newUser.save();
			delete password;

			const payload = {
				sub: newUser._id,
				name: newUser.username,
			};

			console.log(payload);

			const token = jwt.sign(payload, config.jwtSecret);
			res.cookie("token", token, {
				// httpOnly: true,
				// domain: 'localhost:3000'
			});
			console.log("Cookies desde auth/login: ", req.cookies);
			res.json({
				user: req.body,
				token,
			});
		} catch (error) {
			next(
				boom.badRequest(
					"You need an username and password to create an account"
				)
			);
		}
	}
);

router.get("/users", async (req, res) => {
	const Users = await users();
	res.json(Users);
});

module.exports = router;
