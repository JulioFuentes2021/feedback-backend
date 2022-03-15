const passport = require('passport')

const { localStrategyF } = require('./local');

passport.use(localStrategyF);