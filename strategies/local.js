const localStrategy = require("passport-local").Strategy
const passport = require("passport");
const bcrypt = require('bcrypt')
const User = require("../model/user");
const { findUsername } = require("../views/user");
const { findUserById } = require("../views/user")
const config = require("../config/config");
const jwt = require("jsonwebtoken");


// const local = passport.use(
// 	new localStrategy(async (username, password, done) => {
// 		const result = await User.findOne(
// 			{ username: username },
// 			function (err, user) {
// 				if (err) {
// 					return done(err);
// 				}
// 				if (!user) {
// 					return done(null, false);
// 				}
// 				if (!user.verifyPassword(password)) {
// 					return done(null, false);
// 				}
// 				return done(null, user);
// 			}
// 		);
// 		console.log(result);
// 	})
// );

const user = {
	username: 'test-user',
	passwordHash: 'bcrypt-hashed-password',
	id: 1
}


// passport.use(new LocalStrategy(function verify(username, password, cb) {
// 	db.get('SELECT * FROM users WHERE username = ?', [username], function (err, user) {
// 		if (err) { return cb(err); }
// 		if (!user) { return cb(null, false, { message: 'Incorrect username or password.' }); }

// 		crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', function (err, hashedPassword) {
// 			if (err) { return cb(err); }
// 			if (!crypto.timingSafeEqual(user.hashed_password, hashedPassword)) {
// 				return cb(null, false, { message: 'Incorrect username or password.' });
// 			}
// 			return cb(null, user);
// 		});
// 	});
// }));

const localStrategyF = passport.use(new localStrategy(
	async (username, password, done) => {
		try {
			const user = await findUsername(username)
			//console.log(user)

			// const payload = {
			// 	sub: user._id,
			// 	name: user.username,
			// };

			// const token = jwt.sign(payload, config.jwtSecret);

			// console.log(payload);

			// co

			if (!user) {
				return done(null, false)
			}

			const isMatch = await bcrypt.compare(password, user.password)
			if (!isMatch) {
				// console.log('Usuario o contra incorrecta')
				return done(null, false, { message: 'Incorrect username or password.' })
			}

			// const payload = {
			// 	sub: user._id,
			// 	name: user.username,
			// };

			// console.log(payload);

			// const token = jwt.sign(payload, config.jwtSecret);
			// res.cookie("token", token)
			// 	// httpOnly: true,
			// 	// domain: 'localhost:3000'
			// );

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
