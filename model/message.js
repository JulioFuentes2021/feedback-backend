const mongoose = require("mongoose");

const testSchema = { name: { type: String, default: [] } };

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
    test: {
        type: [String],
        default: []
    },
    comment: {
        type: [{ text: String, replies: [String] }],
        default: []
    }
};

const Feedback = mongoose.model("Feedback", feedbackSchema);
module.exports = Feedback;
