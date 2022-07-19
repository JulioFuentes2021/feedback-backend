const Feedback = require('../model/message');
const boom = require('@hapi/boom')

const validateVote = async (req, res, next) => {
    try {
        const { id } = req.params;
        req.id = id

        const feedback = await Feedback.findOne({ _id: id })
        // console.log('Test', feedback, packet[1].id)
        const user = feedback.test.find(id => id === req.user.id)
        console.log('Encontrado', user)
        req.votes = feedback.upvotes;
        if (user !== undefined) {
            req.operation = "-"
            await Feedback.updateOne({ _id: id }, { $pull: { "test": req.user.id } })
        } else {
            req.operation = "+"
            await Feedback.findOneAndUpdate({ _id: id }, { $addToSet: { "test": [req.user.id] } })

        }
        next()
    } catch (error) {
        console.log(error)
        next(boom.internal('Internal Server Error'))
    }
}

module.exports = { validateVote }