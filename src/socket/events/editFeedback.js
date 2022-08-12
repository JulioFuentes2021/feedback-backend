const Feedback = require("../../model/message");

const editFeedback = async (io, socket, data) => {
    const mail = socket.request.user.mail
    const feedback = await Feedback.findOne({ _id: data.id });

    if (feedback.createdBy !== mail) {
        io.to(socket.id).emit('editFail', 'Only the user who created the feedback can edit it.')
    } else {
        await Feedback.findByIdAndUpdate({ _id: data.id }, {
            title: data.title,
            feature: data.feature,
            description: data.description,
        })
        io.emit('update')
        io.emit('receiverSuggestions')
    }
};

module.exports = { editFeedback }