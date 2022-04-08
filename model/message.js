const mongoose = require("mongoose");

const testSchema = { name: { type: Number, default: 1234 } };

const feedbackSchema = {
    title: String,
    feature: String,
    description: {
        type: String,
        required: true,
    },
    upvotes: {
        type: Number,
        default: 0,
    },
    test: [{ name: String }],
};

const Feedback = mongoose.model("Feedback", feedbackSchema);
module.exports = Feedback;
