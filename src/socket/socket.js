const Feedback = require("../model/message");
const passport = require('passport');
const { addFeedback } = require("./events/addFeedback");
const { addReply } = require("./events/addReply");
const { upvote } = require("./events/upvote");
const { editFeedback } = require("./events/editFeedback");
const { updateComments } = require("./events/suggestions");
const { verifyUpvote } = require("./middlewares/verifyUpvote");

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
        // socket.disconnect.connect;

        socket.on("get", async () => {
            const all = await Feedback.find({});
            const allFeedbacks = all.length;
            io.emit("suggestions", allFeedbacks)
            io.emit("getFeed", all)
        })

        socket.on("getSuggestions", async (data) => updateComments(io, socket, data))

        socket.on("addReply", (data) => addReply(data))

        socket.use((packet, next) => verifyUpvote(packet, next, socket))

        socket.on("test", (data) => upvote(io, socket, data))

        socket.on("addFeedback", (data) => addFeedback(io, socket, data))

        socket.on("edit", (data) => editFeedback(io, socket, data))
    })

}

module.exports = socket;