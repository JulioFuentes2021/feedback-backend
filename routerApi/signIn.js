const { Router } = require("express");
const passport = require("passport");
// const User = require("../model/user");
const local = require("../strategies/local");
const authentication = require("../middleware/authentication");

const router = Router();

router.post("/", passport.authenticate('local'), (req, res) => {
	res.send("Sign In");
});

module.exports = router;
