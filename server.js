const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const port = 5000;
const cors = require("cors");
const passport = require("passport");
// const { localStrategyF } = require("./strategies/local");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const { JwtStrategy } = require("./strategies/jwt")
const { catchError, handleError } = require("./middleware/error.handler");
const cookieparser = require("cookie-parser");
//SocketServer
const { createServer } = require("http");
const { Server } = require("socket.io");
const socket = require("./socket/socket");
const Feedback = require("./model/message");
const { Strategy, ExtractJwt } = require('passport-jwt');
const config = require('./config/config');


// const { JwtStrategy } = require('./strategies/jwt')
const app = express();
const routerApi = require("./routerApi/index");
app.use(express.json());
app.use(cookieparser());

const whitelist = ["http://localhost:3000"];
const options = {
	origin: (origin, callback) => {
		if (whitelist.includes(origin) !== 1) {
			callback(null, true);
		} else {
			callback(new Error("no permitido"));
		}
	},
};

const sessionStore = MongoStore.create({
	mongoUrl: "mongodb+srv://julioadmin:julio@cluster0.vkabi.mongodb.net/myFiaarstDatabase?retryWrites=true&w=majority",
	collection: "sessions",
});

app.use(express.static('public'))
app.use(cors({
	credentials: true,
	allowedHeaders: ['Content-Type', 'Authorization'],
	origin: ['http://localhost:3000']
}));
app.use(
	session({
		// key: "isAuthenticated2022f",
		secret: "laksjf30jf3lkajf3",
		resave: false,
		saveUninitialized: true,
		store: sessionStore,
		// cookie: {
		// 	maxAge: 1000 * 60 * 24, //*1 day
		// },
	})
);

require('./strategies/jwt') //!En platzi asi conectaron la estrategia
app.use(passport.initialize());
app.use(passport.session())

const connectionUrl = "mongodb+srv://julioadmin:julio@cluster0.vkabi.mongodb.net/myFiaarstDatabase?retryWrites=true&w=majority";
mongoose.connect(
	connectionUrl,
	{ useNewUrlParser: true, useUnifiedTopology: true },
	err => {
		if (err) throw err;
		console.log("connected");
	}
);

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());


// app.use(express.json);

app.get("/", (req, res) => {
	res.send("Hello, world!");
});

routerApi(app);

app.use(catchError)
app.use(handleError)



const httpServer = createServer(app);

// app.listen(port, () => console.log("Server is ready..."));
const io = new Server(httpServer, {
	cors: {
		origin: ["http://localhost:3000"],
		// allowedHeaders: ["my-custom-header"],
		credentials: true
	}
});


//test

// const options1 = {
// 	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //De donde va a sacar el token
// 	secretOrKey: config.jwtSecret
// };

// passport.use(new Strategy(options1, (payload, done) => {
// 	// console.log(payload)
// 	// return done(null, payload)
// 	console.log('Payload', payload)
// 	User.findOne({ id: payload.id }, function (err, user) {
// 		if (err) {
// 			return done(err, false);
// 		}
// 		if (user) {
// 			return done(null, user);
// 		} else {
// 			return done(null, false);
// 			// or you could create a new account
// 		}
// 	});
// }));

// passport.serializeUser(function (user, done) {
// 	if (user) done(null, user)
// })

// passport.deserializeUser(function (id, done) {
// 	done(null, id)
// })

// const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);
const wrap = middleware => (socket, next) => middleware(socket.request, {}, next)
// io.use(wrap(passport.initialize()));
// io.use(wrap(passport.session()))
io.use(wrap(passport.authenticate('jwt', { session: false })));

io.use((socket, next) => {
	console.log(socket.header)
	next()
	// if (socket.request.user) {
	// 	next();
	// } else {
	// 	console.log("Error socket")
	// 	next(new Error("Unauthorized"))
	// }
});

io.on("connection", (socket) => {
	console.log(`User connected ${socket.id}`)
	// const all = await Feedback.find();
	socket.on("get", async () => {
		const all = await Feedback.find();
		socket.emit("getFeed", all)
	})
	// console.log(socket)

	socket.on("test", (data) => {
		console.log(data.message)
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

// socket(io)

httpServer.listen(port, () => {
	console.log('Server is ready in the port 8000')
})