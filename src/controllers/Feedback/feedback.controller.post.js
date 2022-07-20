const Feedback = require('../../model/message');
const boom = require('@hapi/boom');

const updateComment = async (req, res) => {
    try {
        const comment = req.body.comment;
        await Feedback.findByIdAndUpdate({ _id: req.body.id }, { $addToSet: { comment: { text: comment } } })
        // console.log('comment', req.body)
        res.json({ message: "Comment added successfully" })
    } catch (error) {

    }
};

const addFeedback = async (req, res) => {
    try {
        const { title, feature, description } = req.body;
        console.log(req.body)
        const newFeedback = new Feedback({
            title: title,
            feature: feature,
            description: description,
        });
        await newFeedback.save();
        res.json({
            messsage: "Exitos",
        });
    } catch (error) {
        console.log(error)
        next(boom.badRequest("Title, feature and description are required."));
    }
};

const editFeedback = async (req, res, next) => {
    try {
        const mail = req.user.mail

        const { id } = req.params;
        const feedback = await Feedback.findOne({ _id: id });

        if (feedback.createdBy !== mail) {
            res.status(404).json({ message: 'Only the user who created the feedback can edit it.' })
        } else {
            await Feedback.findByIdAndUpdate({ _id: id }, {
                title: req.body.title,
                feature: req.body.feature,
                description: req.body.description,
            })

            return res.json({ message: 'Good' })
        }
    } catch (error) {
        console.log(error)
        next(boom.badRequest(''))
    }
};

const voteSystem = async (req, res, next) => {
    try {
        if (req.operation === "+") {
            await Feedback.findOneAndUpdate({ _id: req.id }, { $set: { "upvotes": req.votes + 1 } })
        } else {
            await Feedback.findOneAndUpdate({ _id: req.id }, { $set: { "upvotes": req.votes - 1 } })
        }
        res.json({ message: "Vote applied successfully" })
    } catch (error) {
        next(boom.conflict("Operation not correct"))
    }
}

module.exports = {
    updateComment,
    addFeedback,
    editFeedback,
    voteSystem
}