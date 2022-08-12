const Feedback = require("../../model/message");

const updateComments = async (io, socket, data) => {
    await Feedback.findByIdAndUpdate({ _id: data.id }, { $inc: { commentsLength: 1 }, $addToSet: { comment: { text: data.comment, creator: socket.request.user.username, mail: socket.request.user.mail } } })

    io.emit("receiverSuggestions", { username: socket.request.user.username, mail: socket.request.user.mail })
    io.emit("updateComments")
};

module.exports = { updateComments }