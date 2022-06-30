const { Router } = require("express");
const passport = require("passport");
const User = require("../model/user");
const bcrypt = require("bcrypt");
const { users } = require("../views/user");
const boom = require("@hapi/boom");
const { loginAndSignInValidator } = require("../schemas/feedback.schema");
const validatorHandler = require("../middleware/validator.handler");
const { generateToken, generateRefreshToken } = require('../middleware/jwt');

const router = Router();

router.post(
	"/login",
	// validatorHandler(loginAndSignInValidator, "body"),
	passport.authenticate('local'),
	async (req, res, next) => {
		try {
			console.log('Se ejecuto')
			const { token, expiresIn } = generateToken(req.user.id);
			generateRefreshToken(req.user.id, res)

			res.json({
				token,
				expiresIn
			})
			// const { username, password } = req.body;
			// const hash = await bcrypt.hash(password, 10);
			// const newUser = new User({ username, password: hash });
			// await newUser.save();
			// delete password;

			// console.log("Cookies desde auth/login: ", req.cookies);

			// res.json({
			// 	user: req.body,
			// 	token,
			// });
		} catch (error) {
			console.log(error)
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
