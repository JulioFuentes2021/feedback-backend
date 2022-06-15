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

//require('./strategies/jwt') //!En platzi asi conectaron la estrategia
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

httpServer.listen(port, () => {
	console.log('Server is ready in the port 8000')
})
// app.listen(port, () => console.log("Server is ready..."));
const io = new Server(httpServer, {
	cors: {
		origin: ["http://localhost:3000"],
		// allowedHeaders: ["my-custom-header"],
		credentials: true
	}
});
// io.on("connection", (socket) => {
// 	console.log("User connected")
// })

socket(io)