const { Router } = require("express");
const passport = require("passport");
const { users } = require("../views/user");
const { login } = require("../controllers/Auth/login")
const { validatorHandler } = require("../middleware/validator.handler");
const { loginValidation } = require('../schemas/feedback.schema');

const router = Router();

router.post(
	"/login",
	validatorHandler(loginValidation, "body"),
	passport.authenticate('local'),
	login
);

router.get("/users", async (req, res) => {
	const Users = await users();
	res.json(Users);
});

module.exports = router;
