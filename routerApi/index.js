const express = require("express");
const feedback = require("./feedback");
const authRoute = require("./auth");
const signIn = require("./signIn");

const routerApi = app => {
	app.use("/feedback", feedback);
	app.use("/auth", authRoute);
	app.use("/sign-in", signIn);
};

module.exports = routerApi;
