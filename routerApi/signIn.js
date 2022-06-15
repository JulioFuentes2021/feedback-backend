const { Router } = require("express");
const passport = require("passport");
// const User = require("../model/user");
const local = require("../strategies/local");
const authentication = require("../middleware/authentication");
const { loginAndSignInValidator } = require("../schemas/feedback.schema");
const validatorHandler = require("../middleware/validator.handler");
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require("../model/user");
const boom = require("@hapi/boom");
const bcrypt = require('bcrypt');
const { generateToken, generateRefreshToken } = require('../middleware/jwt');

const router = Router();

const authenticate = (req, res, next) => {
	const authHeader = req.headers['authorization']
	const token = authHeader && authHeader.split(' ')[1].split('=')[1]
	if (token == null) return res.sendStatus(401)
	console.log(token);
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

const test = (req, res, next) => {
	const payload = {
		sub: req.body.username,
		// name: user.username,
	};

	const token = jwt.sign(payload, config.jwtSecret);
	res.cookie('token', token)
	next()
}

router.post(
	"/",
	// authenticate,
	validatorHandler(loginAndSignInValidator, "body"),
	// passport.authenticate("local", { session: true }),
	async (req, res, next) => {
		try {
			const { username, password } = req.body;
			const hash = await bcrypt.hash(password, 10);
			const newUser = new User({ username, password: hash });
			await newUser.save();
			delete password;

			console.log("Cookies desde auth/login: ", newUser.id);
			// const { token, expiresIn } = generateToken(newUser.id);
			// generateRefreshToken(newUser.id, res)

			res.json({
				user: req.body,
				// token,
			});
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

router.post("/delete", async (req, res) => {
	const usersDeleted = await User.remove();
	res.json({
		usersRemoved: usersDeleted.deletedCount
	})


})

passport.serializeUser(function (user, cb) {
	process.nextTick(function () {
		cb(null, { id: user.id, username: user.username });
	});
});

passport.deserializeUser(function (user, cb) {
	process.nextTick(function () {
		return cb(null, user);
	});
});

module.exports = router;
