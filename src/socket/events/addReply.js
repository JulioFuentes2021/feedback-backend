const Feedback = require("../../model/message");

const addReply = async (io, socket, data) => {
    const feedback = await Feedback.findOneAndUpdate({ _id: data.feedbackId }, { $inc: { commentsLength: 1 } })
    feedback.comment.id(data.replyId).replies.push({ text: data.mail + " " + data.reply, creator: socket.request.user.username, mail: socket.request.user.mail })
    await feedback.save()

    io.emit("receiverSuggestions")
    io.emit("updateComments")
};

module.exprots = { addReply }