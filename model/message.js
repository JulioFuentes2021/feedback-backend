const mongoose = require('mongoose');

const feedbackSchema = {
    title: String,
    feature: String,
    description: {
        type: String,
        required: true
    },
};

const Feedback = mongoose.model('Feedback', feedbackSchema);
module.exports = Feedback;