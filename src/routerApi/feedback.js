const express = require("express");
const router = express.Router();
const Feedback = require("../model/message");
const passport = require("passport");
const {
	createFeedbackValidation,
	validateSchemaSortParams,
} = require("../schemas/feedback.schema");
const {
	validatorHandler,
	customValidator,
} = require("../middleware/validator.handler");

const {
	getAllFeedbacks,
	getFeedbackById,
	sortFeedbacksByComment,
	sortFeedbacksByVote,
} = require("../controllers/Feedback/feedback.controller");
const {
	addFeedback,
	editFeedback,
	voteSystem,
} = require("../controllers/Feedback/feedback.controller.post");

const { validateVote } = require("../middleware/validateVote");

// Get
router.get("/", (req, res) => {
	res.send("Express.js is amazing :)");
});

router.get("/all", getAllFeedbacks);

router.get("/:id", getFeedbackById);

router.get(
	"/comments/:sort",
	customValidator("sort", validateSchemaSortParams),
	sortFeedbacksByComment
);

router.get(
	"/upvotes/:sort",
	customValidator("sort", validateSchemaSortParams),
	sortFeedbacksByVote
);

router.get("/comment/:id", getFeedbackById);

//! El usuario que finalmente se le asigno ese token desde el cliente debe ahora continuamente enviar estos tokens en los header para que se mantenga la sesion.
router.post(
	"/add",
	// authenticate,
	validatorHandler(createFeedbackValidation, "body"),
	passport.authenticate("jwt", { session: false }),
	addFeedback
);

router.post(
	"/edit/:id",
	validatorHandler(createFeedbackValidation, "body"),
	passport.authenticate("jwt", { session: false }),
	editFeedback
);

router.delete("/delete", async (req, res) => {
	await Feedback.deleteMany();
	res.send("ELiminados");
});

router.patch(
	"/addUpvote/:id",
	passport.authenticate("jwt", { session: false }),
	validateVote,
	voteSystem
);

module.exports = router;
