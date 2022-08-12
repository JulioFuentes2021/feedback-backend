const Feedback = require("../../model/message");

const addFeedback = async (io, socket, data) => {
    const newFeedback = new Feedback({
        title: data.title,
        feature: data.feature,
        description: data.description,
        createdBy: socket.request.user.mail
    });

    await newFeedback.save();
    const all = await Feedback.find({});
    io.emit("update", all)
    const allFeedbacks = all.length;
    io.emit("suggestions", allFeedbacks)
};
;

module.exports = { addFeedback }