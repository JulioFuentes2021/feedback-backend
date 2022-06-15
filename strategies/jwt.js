const { Strategy, ExtractJwt } = require('passport-jwt');
// const boom = require('@hapi/boom');
// const bcrypt = require('bcrypt');
const config = require('../config/config');
const passport = require("passport");
const User = require('../model/user');

// const customCookieExtractor = (req, res) => {
//     console.log('Cookies desde sign-in: ', req.cookies)
//     // let token = null;
//     // // if (req && req.cookies) {
//     // //     token = req.cookies['jwt']
//     // // }
//     // console.log('Este es el token: ', token)
//     // return token
// }

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //De donde va a sacar el token
    secretOrKey: config.jwtSecret
};

//* El payload ya lo recibimos automaticamente
const JwtStrategy = passport.use(new Strategy(options, (payload, done) => {
    // console.log(payload)
    // return done(null, payload)
    console.log(payload)
    User.findOne({ id: payload.id }, function (err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
            // or you could create a new account
        }
    });
}));

module.exports = { JwtStrategy };
