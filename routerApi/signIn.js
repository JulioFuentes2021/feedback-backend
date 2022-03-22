const { Router } = require("express");
const passport = require("passport");
// const User = require("../model/user");
const local = require("../strategies/local");
const authentication = require("../middleware/authentication");

const router = Router();

router.post("/", passport.authenticate('local', { session: true }), (req, res, next) => {
	console.log(res.body);
	try {
		res.status(200).json({
			message: "Sign In is successfully"
		});

	} catch (error) {
		console.log("Error desde post del login")
		next(err)
	}
});

// router.post("/", (req, res, next) => {
// 	passport.authenticate('local', { session: true }, (err, user, info) => {
// 		if (err) next(err)
// 		res.status(200).json({
// 			message: "Sign In is successfully"
// 		})
// 	})
// });

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
