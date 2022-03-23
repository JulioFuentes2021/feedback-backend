const { Strategy, ExtractJwt } = require('passport-jwt');
// const boom = require('@hapi/boom');
// const bcrypt = require('bcrypt');
const config = require('../config/config');
const passport = require("passport");

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //De donde va a sacar el token
    secretOrKey: config.jwtSecret
};

//* El payload ya lo recibimos automaticamente
const JwtStrategy = passport.use(new Strategy(options, (payload, done) => {
    return done(null, payload)
}));

module.exports = { JwtStrategy };
