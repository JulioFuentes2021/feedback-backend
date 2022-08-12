const Feedback = require('../../model/message');

const verifyUpvote = async (packet, next, socket) => {
    if (packet[0] === "test") {
        const feedback = await Feedback.findOne({ _id: packet[1].id })
        const user = feedback.test.find(id => id === socket.request.user.id)
        socket.request.votes = feedback.upvotes;
        if (user !== undefined) {
            socket.request.operation = "-"
            await Feedback.updateOne({ _id: packet[1].id }, { $pull: { "test": socket.request.user.id } })
        } else {
            socket.request.operation = "+"
            await Feedback.findOneAndUpdate({ _id: packet[1].id }, { $addToSet: { "test": [socket.request.user.id] } })

        }
    }

    next()
}

module.exports = { verifyUpvote }