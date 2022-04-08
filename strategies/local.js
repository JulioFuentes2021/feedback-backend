const localStrategy = require("passport-local").Strategy
const passport = require("passport");
const bcrypt = require('bcrypt')
const User = require("../model/user");
const { findUsername } = require("../views/user");
const { findUserById } = require("../views/user")


const localStrategyF = passport.use(new localStrategy(
	async (username, password, done) => {
		try {
			const user = await findUsername(username)

			if (!user) {
				return done(null, false)
			}

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

// passport.use(passport.initialize());
// passport.use(passport.session())

// passport.serializeUser((user, done) => {
// 	done(null, user.id)
// })

// passport.deserializeUser((id, done) => {
// 	done(null, id)
// })

module.exports = { localStrategyF };
