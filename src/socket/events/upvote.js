const Feedback = require("../../model/message");

const upvote = async (io, socket, data) => {
    const id = data.id;
    let newFeed;
    if (socket.request.operation === "+") {
        newFeed = await Feedback.findOneAndUpdate({ _id: id }, { $set: { "upvotes": socket.request.votes + 1 } })
    } else {
        newFeed = await Feedback.findOneAndUpdate({ _id: id }, { $set: { "upvotes": socket.request.votes - 1 } })
    }

    io.emit("update")
    io.emit("justUpvote")
};

module.exports = { upvote }