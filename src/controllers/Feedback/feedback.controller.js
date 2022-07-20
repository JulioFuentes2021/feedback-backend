const Feedback = require('../../model/message');
const boom = require('@hapi/boom');

const getAllFeedbacks = async (req, res, next) => {
    try {
        const data = await Feedback.find({});
        res.json(data);
    } catch (error) {
        next(boom.internal('Server error'))
    }
};

const getFeedbackById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = await Feedback.find({ _id: id });
        res.json(data);
    } catch (error) {
        next(boom.notFound("Id param doesn't exist"));
    }
};

const sortFeedbacksByComment = async (req, res, next) => {
    try {
        const { sort } = req.params;
        const data = await Feedback.find({}).sort({ commentsLength: sort });
        res.json(data);
    } catch (error) {
        next(boom.notFound("Something happened. Verify if the param is correct"));
    }
};

const sortFeedbacksByVote = async (req, res, next) => {
    try {
        const { sort } = req.params;
        const data = await Feedback.find({}).sort({ upvotes: sort });
        res.json(data);
    } catch (error) {
        next(boom.notFound("Something happened. Verify if the param is correct"));
    }
};

module.exports = {
    getAllFeedbacks,
    getFeedbackById,
    sortFeedbacksByComment,
    sortFeedbacksByVote
}