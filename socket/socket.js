const Feedback = require("../model/message");
const passport = require('passport');

const socket = (io) => {
    const wrap = middleware => (socket, next) => middleware(socket.request, {}, next)
    // io.use(wrap(passport.initialize()));
    // io.use(wrap(passport.session()))
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

    io.on("connection", (socket) => {
        console.log(`User connected ${socket.id}`)
        // const all = await Feedback.find();
        socket.on("get", async () => {
            const all = await Feedback.find();
            socket.emit("getFeed", all)
        })
        // console.log(socket)

        socket.on("test", async (data) => {
            // const id = socket.request.user.id;
            const id = data.id;
            // const all = Feedback.findById(id, function (err, user) {
            //     if (err) {
            //         console.log("Erroror: ", err)
            //     } else {
            //         console.log('user', user)
            //     }
            // });
            const upvoteBeforeSum = await Feedback.findOne({ _id: id });
            console.log('beforesum', upvoteBeforeSum)
            // await Feedback.updateOne({ id: id }, { $set: { "upvotes": upvoteBeforeSum.upvotes + 1 } })
            await Feedback.findOneAndUpdate({ _id: id }, { $set: { "upvotes": upvoteBeforeSum.upvotes + 1 } })

            const all = await Feedback.find({});
            io.emit("update", all)
            console.log('Id', id)
        })

        socket.on("addFeedback", async (data) => {
            console.log(data)
            const newFeedback = new Feedback({
                title: data.title,
                feature: data.feature,
                description: data.description,
                // test: test
            });
            //Guarda la base de datos
            await newFeedback.save();
            const all = await Feedback.find({});
            // console.log('All', all)
            io.emit("update", all)
        })
    })

}

module.exports = socket;