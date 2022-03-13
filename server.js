const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const port = 8000;
const cors = require("cors");
const passport = require("passport");
const local = require("./strategies/local");
const session = require("express-session");

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
app.use(express.static('public'))
app.use(cors(options));
app.use(passport.initialize());
app.use(
	session({ secret: "keyboard cat", resave: false, saveUninitialized: true })
);

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
