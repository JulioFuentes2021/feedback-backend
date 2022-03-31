const { Strategy, ExtractJwt } = require('passport-jwt');
// const boom = require('@hapi/boom');
// const bcrypt = require('bcrypt');
const config = require('../config/config');
const passport = require("passport");

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
    // console.log('Im here')
    return done(null, payload)
}));

module.exports = { JwtStrategy };
