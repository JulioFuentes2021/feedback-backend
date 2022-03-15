const localStrategy = require("passport-local").Strategy
const passport = require("passport");
const bcrypt = require('bcrypt')
const User = require("../model/user");
const findUsername = require("../views/user");

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

passport.use(new localStrategy(
	(username, password, done) => {
		findUsername(username, (err, user) => {
			if (err) {
				return done(err)
			}

			// User not found
			if (!user) {
				return done(null, false)
			}

			// Always use hashed passwords and fixed time comparison
			bcrypt.compare(password, user.passwordHash, (err, isValid) => {
				if (err) {
					return done(err)
				}
				if (!isValid) {
					return done(null, false)
				}
				return done(null, user)
			})
		})
	}
))

// module.exports = local;
