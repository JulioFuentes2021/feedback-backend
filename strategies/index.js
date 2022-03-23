const passport = require('passport')

const { localStrategyF } = require('./local');
const { JwtStrategy } = require('./jwt');

passport.use(localStrategyF);
passport.use(JwtStrategy);