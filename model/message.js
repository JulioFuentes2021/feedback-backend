const mongoose = require('mongoose');

const feedbackSchema = {
    title: String,
    feature: String,
    description: String
};

const Feedback = mongoose.model('Feedback', feedbackSchema);
module.exports = Feedback;