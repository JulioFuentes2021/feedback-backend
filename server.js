const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const port = 8000;
const cors = require("cors");
const passport = require("passport");
// const { localStrategyF } = require("./strategies/local");
const session = require("express-session");
const MongoStore = require("connect-mongo");


const app = express();
const routerApi = require("./routerApi/index");
app.use(express.json());

const whitelist = ["http://localhost:8000/"];
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
app.use(cors(options));
app.use(
	session({
		key: "isAuthenticated",
		secret: "laksjf30jf3lkajf3",
		resave: false,
		saveUninitialized: true,
		store: sessionStore,
		cookie: {
			maxAge: 1000 * 60 * 24, //*1 day
		},
	})
);

//require('./strategies/index') //!En platzi asi conectaron la estrategia
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

app.use(bodyParser.urlencoded({ extended: true }));

// app.use(express.json);

app.get("/", (req, res) => {
	res.send("Hello, world!");
});

routerApi(app);

app.listen(port, () => console.log("Server is ready..."));
