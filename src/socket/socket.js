const Feedback = require("../model/message");
const passport = require('passport');

const socket = (io) => {
    const wrap = middleware => (socket, next) => middleware(socket.request, {}, next)
    io.use(wrap(passport.authenticate('jwt', { session: false })));

    io.use((socket, next) => {
        if (socket.request.user) {
            next();
        } else {
            console.log("Error socket")
            next(new Error("Unauthorized"))
        }
    });

    io.on("connection", (socket) => {
        console.log(`User connected ${socket.id}`)
        socket.disconnect.connect;

        socket.on("get", async () => {
            const all = await Feedback.find({});
            const allFeedbacks = all.length;
            io.emit("suggestions", allFeedbacks)
            io.emit("getFeed", all)
        })

        socket.on("getSuggestions", async (data) => {
            const feedback = await Feedback.findByIdAndUpdate({ _id: data.id }, { $inc: { commentsLength: 1 }, $addToSet: { comment: { text: data.comment, creator: socket.request.user.username, mail: socket.request.user.mail } } })

            io.emit("receiverSuggestions", { username: socket.request.user.username, mail: socket.request.user.mail })
            io.emit("updateComments")
        })

        socket.on("addReply", async (data) => {
            const feedback = await Feedback.findOneAndUpdate({ _id: data.feedbackId }, { $inc: { commentsLength: 1 } })
            feedback.comment.id(data.replyId).replies.push({ text: data.mail + " " + data.reply, creator: socket.request.user.username, mail: socket.request.user.mail })
            await feedback.save()

            io.emit("receiverSuggestions")
            io.emit("updateComments")
        })

        socket.use(async (packet, next) => {

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
        })

        socket.on("test", async (data) => {
            const id = data.id;
            let newFeed;
            if (socket.request.operation === "+") {
                newFeed = await Feedback.findOneAndUpdate({ _id: id }, { $set: { "upvotes": socket.request.votes + 1 } })
            } else {
                newFeed = await Feedback.findOneAndUpdate({ _id: id }, { $set: { "upvotes": socket.request.votes - 1 } })
            }

            io.emit("update")
            io.emit("justUpvote")
        })

        socket.on("addFeedback", async (data) => {
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
        })

        socket.on("edit", async (data) => {
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
        })
    })

}

module.exports = socket;