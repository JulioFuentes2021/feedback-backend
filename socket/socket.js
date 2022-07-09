const Feedback = require("../model/message");
const User = require("../model/user");
const passport = require('passport');
const validatorHandler = require('../middleware/validator.handler');
const { createFeedbackValidation } = require('../schemas/feedback.schema');

const checkToken = (socket, next, io) => {

    io.use(wrap(passport.authenticate('jwt', { session: false })));
    io.use((socket, next) => {
        console.log(socket.header)
        // next()
        if (socket.request.user) {
            next();
        } else {
            console.log("Error socket")
            next(new Error("Unauthorized"))
        }
    });
}


const socket = (io) => {
    const wrap = middleware => (socket, next) => middleware(socket.request, {}, next)
    // io.use(wrap(passport.initialize()));
    // io.use(wrap(passport.session()))
    io.use(wrap(passport.authenticate('jwt', { session: false })));

    io.use((socket, next) => {
        // console.log('Socket from middleware', socket)
        console.log('Socket.request.user', socket.request.user)
        // next()
        if (socket.request.user) {
            next();
        } else {
            console.log("Error socket")
            next(new Error("Unauthorized"))
        }
    });
    io.use((socket, next) => {
        console.log(socket)
        next()
    })

    //!Create a context or redux to do the connection when the user makes login 

    io.on("connection", (socket) => {
        console.log(`User connected ${socket.id}`)
        socket.disconnect.connect;
        // const all = await Feedback.find();
        socket.on("get", async () => {
            const all = await Feedback.find({});
            const allFeedbacks = all.length;
            io.emit("suggestions", allFeedbacks)
            io.emit("getFeed", all)
        })

        socket.on("getSuggestions", async (data) => {
            // const comment = req.body.comment;
            const feedback = await Feedback.findByIdAndUpdate({ _id: data.id }, { $inc: { commentsLength: 1 }, $addToSet: { comment: { text: data.comment, creator: socket.request.user.username, mail: socket.request.user.mail } } })
            console.log(socket.request.user)


            io.emit("receiverSuggestions", { username: socket.request.user.username, mail: socket.request.user.mail })
            io.emit("updateComments")
        })

        socket.on("addReply", async (data) => {
            console.log(data)
            // const feedback = await Feedback.findByIdAndUpdate({ _id: data.id }, { $addToSet: { comment[2].replies: "something" } })
            const feedback = await Feedback.findOneAndUpdate({ _id: data.feedbackId }, { $inc: { commentsLength: 1 } })
            // const feedback = await Feedback.findByIdAndUpdate({ _id: data.id }, { $addToSet: { comment: { text: data.comment, creator: socket.request.user.username, mail: socket.request.user.mail } } })
            // const doc = Feedback.comment.id("62ba4ef587bf7203aa05cea6")
            // feedback.commentsLength += 1
            feedback.comment.id(data.replyId).replies.push({ text: data.mail + " " + data.reply, creator: socket.request.user.username, mail: socket.request.user.mail })
            await feedback.save()
            console.log("reply", feedback.comment.id(data.replyId))

            io.emit("receiverSuggestions")
            io.emit("updateComments")
            // console.log('REply Id', data.replyId)
        })

        // console.log(socket)

        socket.use(async (packet, next) => {
            console.log("Middleware en un eventoo....", packet)

            if (packet[0] === "test") {
                const feedback = await Feedback.findOne({ _id: packet[1].id })
                console.log('Test', feedback, packet[1].id)
                const user = feedback.test.find(id => id === socket.request.user.id)
                console.log('Encontrado', user)
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
            // const id = socket.request.user.id;
            const id = data.id;
            console.log("OP", socket.request.operation)

            // const upvoteBeforeSum = await Feedback.findOne({ _id: id });
            // console.log('beforesum', upvoteBeforeSum)
            // await Feedback.updateOne({ id: id }, { $set: { "upvotes": upvoteBeforeSum.upvotes + 1 } })

            if (socket.request.operation === "+") {
                await Feedback.findOneAndUpdate({ _id: id }, { $set: { "upvotes": socket.request.votes + 1 } })
            } else {
                await Feedback.findOneAndUpdate({ _id: id }, { $set: { "upvotes": socket.request.votes - 1 } })
            }

            const all = await Feedback.find({});
            io.emit("update", all)
            io.emit("justUpvote")
            console.log('Id', socket.request.user)
        })

        socket.on("addFeedback", async (data) => {
            console.log(data)
            const newFeedback = new Feedback({
                title: data.title,
                feature: data.feature,
                description: data.description,
                createdBy: socket.request.user.mail
                // test: test
            });
            //Guarda la base de datos
            await newFeedback.save();
            const all = await Feedback.find({});
            // console.log('All', all.length)
            io.emit("update", all)
            const allFeedbacks = all.length;
            io.emit("suggestions", allFeedbacks)
        })

        socket.on("edit", async (data) => {
            const mail = socket.request.user.mail
            // console.log('USER ID ', socket.request.user)
            // const user = await User.findOne({ mail: mail })
            const feedback = await Feedback.findOne({ _id: data.id });
            console.log('FEed', feedback)
            console.log('FEed', mail)
            if (!feedback.createdBy === mail) throw new Error('You are not the creator!')
            await Feedback.findByIdAndUpdate({ _id: data.id }, {
                title: data.title,
                feature: data.feature,
                description: data.description,
            })

            // console.log('User ', user)
        })
    })

}

module.exports = socket;