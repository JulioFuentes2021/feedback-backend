const { Router } = require("express");
const passport = require("passport");
const { loginAndSignInValidator } = require("../schemas/feedback.schema");
const { validatorHandler } = require("../middleware/validator.handler");
const User = require("../model/user");
const { signIn } = require('../controllers/Auth/signIn');

const router = Router();

router.post(
	"/",
	validatorHandler(loginAndSignInValidator, "body"),
	signIn
);

router.post("/delete", async (req, res) => {
	const usersDeleted = await User.remove();
	res.json({
		usersRemoved: usersDeleted.deletedCount
	})
})

module.exports = router;
