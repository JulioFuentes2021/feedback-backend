const localStrategy = require("passport-local").Strategy
const passport = require("passport");
const bcrypt = require('bcrypt')
const User = require("../model/user");
const { findUsername } = require("../views/user");
const { findUserById } = require("../views/user");
const jsonwebtoken = require('jsonwebtoken');

const localStrategyF = passport.use(new localStrategy(
	async (mail, password, done) => {
		console.log("Entro")
		try {
			const user = await findUsername(mail)
			console.log(user)
			if (!user) {
				return done(null, false)
			}

			// const { id } = jwt.verify(user.password, process.env.JWT_REFRESH)
			console.log("This is the mail", mail)
			const isMatch = await bcrypt.compare(password, user.password)
			if (!isMatch) {
				// console.log('Usuario o contra incorrecta')
				return done(null, false, { message: 'Incorrect username or password.' })
			}

			return done(null, user)
		} catch (error) {
			return done(error, false)
		}
	}
))

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

// passport.use(passport.initialize());
// passport.use(passport.session())

// passport.serializeUser((user, done) => {
// 	done(null, user.id)
// })

// passport.deserializeUser((id, done) => {
// 	done(null, id)
// })

module.exports = { localStrategyF };
